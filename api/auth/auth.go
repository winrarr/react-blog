package auth

import (
	"api/database"
	"api/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type sessionInfo struct {
	expiresAt int64
	userLevel models.UserLevel
}

var sessions = map[string]sessionInfo{}

func init() {
	go cleanupSessions()
}

func cleanupSessions() {
	batchIndex := 0
	for token, sessionInfo := range sessions {
		if batchIndex > 10000 {
			batchIndex = 0
			time.Sleep(time.Hour)
		}
		if sessionInfo.expiresAt < time.Now().Unix() {
			delete(sessions, token)
		}
		batchIndex++
	}
}

func NewUser(username string, password string) (*models.Auth, StatusMessage) {
	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := database.UserCollection.FindOne(ctx, bson.M{"username": username}).Err()
	if err == nil {
		return nil, UserAlreadyExists
	}

	// hash and salt password
	HSPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, InternalError
	}

	// save in database and return auth
	userLevel := models.User
	refreshTokenExp, accessTokenExp := newTokens(username, userLevel)

	DBUser := models.DBUser{
		Username:        username,
		HSPassword:      HSPassword,
		UserLevel:       userLevel,
		RefreshTokenExp: refreshTokenExp,
	}

	return updateDBAndSessions(DBUser, accessTokenExp)
}

func FindUser(username string, password string) (*models.Auth, StatusMessage) {
	// check if user exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var DBUser models.DBUser
	err := database.UserCollection.FindOne(ctx, bson.M{"username": username}).Decode(&DBUser)
	if err != nil {
		return nil, UserDoesNotExist
	}

	// check if given password is correct
	err = bcrypt.CompareHashAndPassword(DBUser.HSPassword, []byte(password))
	if err != nil {
		return nil, IncorrectPassword
	}

	// update refresh token and return auth
	refreshTokenExp, accessTokenExp := newTokens(username, DBUser.UserLevel)

	DBUser.RefreshTokenExp = refreshTokenExp
	return updateDBAndSessions(DBUser, accessTokenExp)
}

func LogoutUser(tokenString string) StatusMessage {
	claims, err := ParseAccessToken(tokenString)
	if err != nil {
		return InvalidToken
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	refreshTokenExp := models.RefreshTokenExp{
		Token:     "",
		ExpiresAt: 0,
	}
	_, err = database.UserCollection.UpdateOne(ctx, bson.M{"username": claims.StandardClaims.Subject}, bson.M{"$set": bson.M{"refreshtokenexp": refreshTokenExp}})
	if err != nil {
		return UserDoesNotExist
	}

	return Success
}

func RefreshAccessToken(tokenString string) (*models.Auth, StatusMessage) {
	// validate and parse refresh token
	claims, err := ParseRefreshToken(tokenString)
	if err != nil {
		return nil, InvalidToken
	}

	username := claims.Subject

	// get user from database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var DBUser models.DBUser
	err = database.UserCollection.FindOne(ctx, bson.M{"username": username}).Decode(&DBUser)
	if err != nil {
		return nil, UserDoesNotExist
	}

	if DBUser.RefreshTokenExp.Token == "" {
		return nil, InvalidToken
	}

	// check that refresh token is valid
	if DBUser.RefreshTokenExp.ExpiresAt < time.Now().Unix() {
		return nil, RefreshTokenExpired
	}

	if DBUser.RefreshTokenExp.Token != tokenString {
		return nil, InvalidToken
	}

	// update refresh token and return auth
	refreshTokenExp, accessTokenExp := newTokens(username, DBUser.UserLevel)

	DBUser.RefreshTokenExp = refreshTokenExp
	return updateDBAndSessions(DBUser, accessTokenExp)
}

func updateDBAndSessions(DBUser models.DBUser, accessTokenExp models.AccessTokenExp) (*models.Auth, StatusMessage) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// update database
	_, err := database.UserCollection.UpdateOne(ctx, bson.M{"username": DBUser.Username}, bson.M{"$set": bson.M{"refreshtokenexp": DBUser.RefreshTokenExp}})
	if err != nil {
		return nil, UserDoesNotExist
	}

	// update sessions
	sessions[accessTokenExp.Token] = sessionInfo{
		expiresAt: accessTokenExp.ExpiresAt,
		userLevel: DBUser.UserLevel,
	}

	// return new auth
	auth := models.Auth{
		RefreshToken: DBUser.RefreshTokenExp.Token,
		AccessToken:  accessTokenExp.Token,
		UserLevel:    DBUser.UserLevel,
	}

	return &auth, Success
}

func VerifyAccessToken(tokenString string, requiredUserLevel models.UserLevel) (string, bool) {
	claims, err := ParseAccessToken(tokenString)
	if err != nil {
		return "", false
	}

	sessionInfo, ok := sessions[tokenString]
	if !ok {
		return "", false
	}

	if sessionInfo.expiresAt < time.Now().Unix() {
		delete(sessions, tokenString)
		return "", false
	}

	if sessionInfo.userLevel < requiredUserLevel {
		return "", false
	}

	return claims.StandardClaims.Subject, true
}
