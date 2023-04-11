package auth

import (
	"api/database"
	"api/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

func Signup(username string, password string) (*models.AuthInfo, StatusMessage) {
	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := database.UserCollection.FindOne(ctx, bson.M{"_id": username}).Err()
	if err == nil {
		return nil, UserAlreadyExists
	}

	// hash and salt password
	hspassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, InternalError
	}

	refreshTokenExp, accessTokenExp := NewTokens(username, models.Standard)
	user := models.User{
		Username:        username,
		HSPassword:      hspassword,
		UserLevel:       models.Standard,
		RefreshTokenExp: refreshTokenExp,
	}

	_, err = database.UserCollection.InsertOne(ctx, user)
	if err != nil {
		return nil, InternalError
	}

	return &models.AuthInfo{
		RefreshToken: refreshTokenExp,
		AccessToken:  accessTokenExp,
		UserLevel:    user.UserLevel,
	}, Success
}

func Login(username string, password string) (*models.AuthInfo, StatusMessage) {
	// check if user exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err := database.UserCollection.FindOne(ctx, bson.M{"_id": username}).Decode(&user)
	if err != nil {
		return nil, UserNotFound
	}

	// check if given password is correct
	err = bcrypt.CompareHashAndPassword(user.HSPassword, []byte(password))
	if err != nil {
		return nil, IncorrectPassword
	}

	// update refresh token and return auth
	return refreshUser(username, user.UserLevel)
}

func Logout(tokenString string) StatusMessage {
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
	if result.ModifiedCount != 1 {
		return UserNotFound
	}

	return Success
}

func Refresh(tokenString string) (*models.AuthInfo, StatusMessage) {
	// validate and parse refresh token
	claims, err := ParseRefreshToken(tokenString)
	if err != nil {
		return nil, InvalidToken
	}

	username := claims.Subject

	// get user from database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.User
	err = database.UserCollection.FindOne(ctx, bson.M{"_id": username}).Decode(&user)
	if err != nil {
		return nil, UserNotFound
	}

	if user.RefreshTokenExp.Token == "" || user.RefreshTokenExp.Token != tokenString {
		return nil, InvalidToken
	}

	// update refresh token and return auth
	return refreshUser(username, user.UserLevel)
}

func refreshUser(username string, userLevel models.UserLevel) (*models.AuthInfo, StatusMessage) {
	refreshTokenExp, accessTokenExp := NewTokens(username, userLevel)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// update database
	_, err := database.UserCollection.UpdateByID(ctx, username, bson.M{"$set": bson.M{"refreshtokenexp": refreshTokenExp}})
	if err != nil {
		return nil, UserNotFound
	}

	return &models.AuthInfo{
		RefreshToken: refreshTokenExp,
		AccessToken:  accessTokenExp,
		UserLevel:    userLevel,
	}, Success
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
