package auth

import (
	"api/configs"
	"api/models"
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type accessTokenInfo struct {
	expires   time.Time
	userLevel models.UserLevel
}

var accessTokens = map[string]accessTokenInfo{}

func Authorise(c *gin.Context) {
	// utils.PrintBody(c)
}

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")

const (
	Success = iota
	InternalError
	Specified
)

type CreateStatus int

const (
	UserAlreadyExists CreateStatus = iota + Specified
)

func NewUser(username string, password string) (*models.Auth, CreateStatus) {
	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := userCollection.FindOne(ctx, bson.M{"username": username}).Err()
	if err == nil {
		return nil, UserAlreadyExists
	}

	// hash and salt password and save it in the database
	HSPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, InternalError
	}

	auth := NewAuth(models.User)

	user := models.DBUser{
		Username:     username,
		HSPassword:   HSPassword,
		UserLevel:    auth.UserLevel,
		RefreshToken: auth.RefreshToken,
	}

	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		return nil, InternalError
	}

	return &auth, Success
}

type CheckStatus int

const (
	UserDoesNotExist CheckStatus = iota + Specified
	IncorrectPassword
)

func CheckUser(username string, password string) (*models.Auth, CheckStatus) {
	// check if user exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.DBUser
	err := userCollection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		return nil, UserDoesNotExist
	}

	// check if given password is correct
	err = bcrypt.CompareHashAndPassword(user.HSPassword, []byte(password))
	if err != nil {
		return nil, IncorrectPassword
	}

	// update refresh token
	auth := NewAuth(user.UserLevel)
	user.RefreshToken = auth.RefreshToken
	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		return nil, InternalError
	}

	return &auth, Success
}

func NewAuth(userLevel models.UserLevel) models.Auth {
	return models.Auth{
		AccessToken:  NewAccessToken(userLevel),
		RefreshToken: NewRefreshToken(),
		UserLevel:    userLevel,
	}
}

func NewRefreshToken() string {
	return uuid.NewString()
}

func NewAccessToken(userLevel models.UserLevel) string {
	accessToken := uuid.NewString()
	accessTokens[accessToken] = accessTokenInfo{
		time.Now(),
		userLevel,
	}
	return accessToken
}
