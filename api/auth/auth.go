package auth

import (
	"api/database"
	"api/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func NewUser(username string, password string) (*models.Auth, StatusMessage) {
	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := database.UserCollection.FindOne(ctx, bson.M{"_id": username}).Err()
	if err == nil {
		return nil, UserAlreadyExists
	}

	// hash and salt password
	HSPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, InternalError
	}

	// save in database and return auth
	userLevel := models.Standard
	refreshTokenExp, accessTokenExp := newTokens(username, userLevel)

	DBUser := models.User{
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
	err := database.UserCollection.FindOne(ctx, bson.M{"_id": username}).Decode(&DBUser)
	if err != nil {
		return nil, UserDoesNotExist
	}

	// check if given password is correct
	err = bcrypt.CompareHashAndPassword(user.HSPassword, []byte(password))
	if err != nil {
		return nil, IncorrectPassword
	}

	// update refresh token and return auth
	refreshTokenExp, accessTokenExp := newTokens(username, user.UserLevel)

	user.RefreshTokenExp = refreshTokenExp
	return updateDBAndSessions(user, accessTokenExp)
}

func LogoutUser(tokenString string) StatusMessage {
	claims, err := ParseAccessToken(tokenString)
	if err != nil {
		return InvalidToken
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	refreshTokenExp := models.TokenExp{
		Token:     "",
		ExpiresAt: 0,
	}
	result, _ := database.UserCollection.UpdateByID(ctx, claims.StandardClaims.Subject, bson.M{"$set": bson.M{"refreshtokenexp": refreshTokenExp}})
	if result.ModifiedCount < 1 {
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
	err = database.UserCollection.FindOne(ctx, bson.M{"_id": username}).Decode(&DBUser)
	if err != nil {
		return nil, UserDoesNotExist
	}

	if DBUser.RefreshTokenExp.Token == "" || DBUser.RefreshTokenExp.Token != tokenString {
		return nil, InvalidToken
	}

	// update refresh token and return auth
	refreshTokenExp, accessTokenExp := newTokens(username, DBUser.UserLevel)

	DBUser.RefreshTokenExp = refreshTokenExp
	return updateDBAndSessions(DBUser, accessTokenExp)
}

func updateDBAndSessions(DBUser models.DBUser, accessTokenExp models.TokenExp) (*models.Auth, StatusMessage) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// update database
	_, err := database.UserCollection.UpdateByID(ctx, DBUser.Username, bson.M{"$set": bson.M{"refreshtokenexp": DBUser.RefreshTokenExp}})
	if err != nil {
		return nil, UserDoesNotExist
	}

	// return new auth
	auth := models.Auth{
		RefreshToken: user.RefreshTokenExp.Token,
		AccessToken:  accessTokenExp.Token,
		UserLevel:    user.UserLevel,
	}

	return &auth, Success
}

func VerifyAccessToken(tokenString string, requiredUserLevel models.UserLevel) (string, bool) {
	claims, err := ParseAccessToken(tokenString)
	if err != nil {
		return "", false
	}

	if claims.StandardClaims.ExpiresAt < time.Now().Unix() {
		return "", false
	}

	if claims.UserLevel < requiredUserLevel {
		return "", false
	}

	return claims.StandardClaims.Subject, true
}
