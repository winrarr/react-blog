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

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")

type Auth struct {
	RefreshToken models.RefreshToken
	AccessToken  models.AccessToken
	UserLevel    models.UserLevel
}

type accessTokenInfo struct {
	expires   time.Time
	userLevel models.UserLevel
}

var accessTokens = map[models.AccessToken]accessTokenInfo{}

func Authorise(c *gin.Context) {
	// utils.PrintBody(c)
}

func NewUser(username string, password string) (*Auth, CreateStatus) {
	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := userCollection.FindOne(ctx, bson.M{"username": username}).Err()
	if err == nil {
		return nil, UserAlreadyExists
	}

	// hash and salt password
	HSPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, InternalError
	}

	// save in database and return auth
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

func CheckUser(username string, password string) (*Auth, CheckStatus) {
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

	// update refresh token and return auth
	auth := NewAuth(user.UserLevel)
	user.RefreshToken = auth.RefreshToken
	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		return nil, InternalError
	}

	return &auth, Success
}

func NewAuth(userLevel models.UserLevel) Auth {
	return Auth{
		RefreshToken: NewRefreshToken(),
		AccessToken:  NewAccessToken(userLevel),
		UserLevel:    userLevel,
	}
}

func NewRefreshToken() models.RefreshToken {
	return models.RefreshToken(uuid.NewString())
}

func NewAccessToken(userLevel models.UserLevel) models.AccessToken {
	accessToken := models.AccessToken(uuid.NewString())
	accessTokens[accessToken] = accessTokenInfo{
		time.Now().Add(time.Hour),
		userLevel,
	}
	return accessToken
}
