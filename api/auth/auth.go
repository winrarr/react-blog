package auth

import (
	"api/database"
	"api/models"
	"context"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type sessionInfo struct {
	accessToken string
	expiresAt   int64
	userLevel   models.UserLevel
}

var sessions = map[string]sessionInfo{}

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

	return updateDBAndSessions(DBUser, accessTokenExp, refreshTokenExp.Token)
}

func CheckUser(username string, password string) (*models.Auth, StatusMessage) {
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
	return updateDBAndSessions(DBUser, accessTokenExp, refreshTokenExp.Token)
}

func RefreshAccessToken(tokenString string) (*models.Auth, StatusMessage) {
	claims, err := ParseRefreshToken(tokenString)
	if err != nil {
		return nil, InvalidToken
	}

	username := claims.Subject

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var DBUser models.DBUser
	err = database.UserCollection.FindOne(ctx, bson.M{"username": username}).Decode(&DBUser)
	if err != nil {
		return nil, UserDoesNotExist
	}

	refreshTokenExp, accessTokenExp := newTokens(username, DBUser.UserLevel)

	// update refresh token and return auth
	DBUser.RefreshTokenExp = refreshTokenExp
	return updateDBAndSessions(DBUser, accessTokenExp, refreshTokenExp.Token)
}

func updateDBAndSessions(DBUser models.DBUser, accessTokenExp models.AccessTokenExp, refreshToken string) (*models.Auth, StatusMessage) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := database.UserCollection.InsertOne(ctx, DBUser)
	if err != nil {
		return nil, InternalError
	}

	sessions[DBUser.Username] = sessionInfo{
		accessToken: accessTokenExp.Token,
		expiresAt:   accessTokenExp.ExpiresAt,
		userLevel:   DBUser.UserLevel,
	}

	auth := models.Auth{
		RefreshToken: refreshToken,
		AccessToken:  accessTokenExp.Token,
		UserLevel:    DBUser.UserLevel,
	}

	return &auth, Success
}

func VerifyAccessToken(authHeader string, requiredUserLevel models.UserLevel) bool {
	tokenString, found := strings.CutPrefix(authHeader, "Bearer ")
	if !found {
		return false
	}

	claims, err := ParseAccessToken(tokenString)
	if err != nil {
		return false
	}

	username := claims.StandardClaims.Subject

	sessionInfo, ok := sessions[username]
	if !ok {
		return false
	}

	if tokenString != sessionInfo.accessToken {
		return false
	}

	if sessionInfo.expiresAt < time.Now().Unix() {
		return false
	}

	if sessionInfo.userLevel < requiredUserLevel {
		return false
	}

	return true
}
