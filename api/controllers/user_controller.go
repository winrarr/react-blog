package controllers

import (
	"api/auth"
	"api/configs"
	"api/models"
	"api/utils"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")

func init() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	userCollection.Drop(ctx)
}

// POST /signup
func CreateUser(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	auth, createdStatus := auth.NewUser(credentials.Username, credentials.Password)
	httpStatus, created := utils.CreateStatusToHttpStatus(createdStatus)

	if created {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// POST /login
func Login(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	auth, checkStatus := auth.CheckUser(credentials.Username, credentials.Password)
	httpStatus, authed := utils.CheckStatusToHttpStatus(checkStatus)

	if authed {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func sendAuth(auth *auth.Auth, httpStatus int, c *gin.Context) {
	c.SetCookie("refreshToken", auth.RefreshToken, int(time.Hour)*24*365, "/", "localhost", true, true)

	authResponse := models.AuthResponse{
		AccessToken: auth.AccessToken,
		UserLevel:   auth.UserLevel,
	}
	c.JSON(httpStatus, authResponse)
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
