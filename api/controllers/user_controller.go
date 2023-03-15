package controllers

import (
	"api/configs"
	"api/models"
	"api/sessions"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")

func init() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	userCollection.Drop(ctx)
}

// POST /signup
func CreateUser(c *gin.Context) {
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	HSPassword, err := bcrypt.GenerateFromPassword([]byte(credentials.Password), bcrypt.DefaultCost)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	user := models.DBUser{
		Username:   credentials.Username,
		HSPassword: HSPassword,
		UserLevel:  models.Default,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.SetCookie("session_token", sessions.NewSession(user.UserLevel), 2, "/", "localhost", false, false)
}

// POST /login
func Login(c *gin.Context) {
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.DBUser
	err := userCollection.FindOne(ctx, bson.M{"username": credentials.Username}).Decode(&user)
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword(user.HSPassword, []byte(credentials.Password))
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	c.SetCookie("session_token", sessions.NewSession(user.UserLevel), 2, "/", "localhost", false, false)
}

// GET /users
func GetAllUsers(c *gin.Context) {
	var users []models.DBUser

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	results, err := userCollection.Find(ctx, bson.M{})
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var user models.DBUser
		if err = results.Decode(&user); err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		users = append(users, user)
	}

	c.IndentedJSON(http.StatusOK, users)
}
