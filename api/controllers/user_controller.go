package controllers

import (
	"api/configs"
	"api/models"
	"api/sessions"
	"api/utils"
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
	utils.PrintBody(c)
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := userCollection.FindOne(ctx, bson.M{"username": credentials.Username}).Err()
	if err == nil {
		c.AbortWithStatus(http.StatusConflict)
		return
	}

	// hash and salt password and save it in the database
	HSPassword, err := bcrypt.GenerateFromPassword([]byte(credentials.Password), bcrypt.DefaultCost)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	user := models.DBUser{
		Username:   credentials.Username,
		HSPassword: HSPassword,
		UserLevel:  models.User,
	}

	defer cancel()

	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	// return the session id
	session := sessions.NewSession(user.UserLevel)
	c.JSON(http.StatusCreated, models.NewAuth(session, user.UserLevel))
}

// POST /signin
func Login(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if user exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user models.DBUser
	err := userCollection.FindOne(ctx, bson.M{"username": credentials.Username}).Decode(&user)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if given password is correct
	err = bcrypt.CompareHashAndPassword(user.HSPassword, []byte(credentials.Password))
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// return the session auth
	session := sessions.NewSession(user.UserLevel)
	c.JSON(http.StatusOK, models.NewAuth(session, user.UserLevel))
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
