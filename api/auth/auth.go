package auth

import (
	"api/database"
	"api/models"
	"context"
	"time"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type Auth struct {
	RefreshToken string
	AccessToken  string
	UserLevel    models.UserLevel
}

type sessionInfo struct {
	accessToken AccessToken
	expiresAt   time.Time
	userLevel   models.UserLevel
}

var sessions = map[string]sessionInfo{}

func NewUser(username string, password string) (*Auth, StatusMessage) {
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
	refreshToken := newRefreshToken(username)
	DBUser := models.DBUser{
		Username:     username,
		HSPassword:   HSPassword,
		UserLevel:    models.User,
		RefreshToken: refreshToken,
	}

	_, err = database.UserCollection.InsertOne(ctx, DBUser)
	if err != nil {
		return nil, InternalError
	}

	refreshToken, accessToken := newTokens(username, DBUser.UserLevel)
	sessions[username] = sessionInfo{
		accessToken: accessToken,
		expiresAt:   accessToken.ExpiresAt,
		userLevel:   DBUser.UserLevel,
	}

	auth := Auth{
		RefreshToken: refreshToken,
	}

	return &auth, Success
}

func CheckUser(username string, password string) (*Auth, StatusMessage) {
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
	refreshToken, accessToken := newTokens(username, DBUser.UserLevel)

	DBUser.RefreshToken = refreshToken
	_, err = database.UserCollection.InsertOne(ctx, DBUser)
	if err != nil {
		return nil, InternalError
	}

	sessions[username] = sessionInfo{
		accessToken: accessToken,
		expiresAt:   accessToken.ExpiresAt,
		userLevel:   DBUser.UserLevel,
	}

	auth := Auth{
		RefreshToken: refreshToken,
		AccessToken:  accessToken.Token,
		UserLevel:    DBUser.UserLevel,
	}

	return &auth, Success
}

func RefreshToken(tokenString string) (*Auth, StatusMessage) {
	token, err := jwt.Parse(tokenString, keyFunc("REFRESH_TOKEN_SECRET"))
	if err != nil {
		return nil, InvalidToken
	}

	claims, ok := token.Claims.(jwt.StandardClaims)
	if !ok {
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

	refreshToken, accessToken := newTokens(username, DBUser.UserLevel)

	DBUser.RefreshToken = refreshToken
	_, err = database.UserCollection.InsertOne(ctx, DBUser)
	if err != nil {
		return nil, InternalError
	}

	sessions[username] = sessionInfo{
		accessToken: accessToken,
		expiresAt:   accessToken.ExpiresAt,
		userLevel:   DBUser.UserLevel,
	}

	auth := Auth{
		RefreshToken: refreshToken,
		AccessToken:  accessToken.Token,
		UserLevel:    DBUser.UserLevel,
	}

	return &auth, Success
}

func VerifyAccessToken(authHeader string) bool {
	claims, err := ParseAccessToken(authHeader)
	if err != nil {
		return false
	}

	username := claims.StandardClaims.Subject

	sessionInfo, ok := sessions[username]
	if !ok {
		return false
	}

	if sessionInfo.expiresAt.Before(time.Now()) {
		return false
	}

	return true
}
