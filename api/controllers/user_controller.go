package controllers

import (
	"api/auth"
	"api/configs"
	"api/models"
	"context"
	"log"
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
	httpStatus, created := createStatusToHttpStatus(createdStatus)

	if created {
		c.JSON(httpStatus, auth)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func createStatusToHttpStatus(status auth.CreateStatus) (int, bool) {
	switch status {
	case auth.Success:
		return http.StatusCreated, true
	case auth.InternalError:
		return http.StatusInternalServerError, false
	case auth.UserAlreadyExists:
		return http.StatusConflict, false
	default:
		log.Fatal("unexpected auth create status")
	}
	return -1, false
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
	httpStatus, authed := checkStatusToHttpStatus(checkStatus)

	if authed {
		c.JSON(httpStatus, auth)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func checkStatusToHttpStatus(status auth.CheckStatus) (int, bool) {
	switch status {
	case auth.Success:
		return http.StatusOK, true
	case auth.InternalError:
		return http.StatusInternalServerError, false
	case auth.UserDoesNotExist:
		return http.StatusBadRequest, false
	case auth.IncorrectPassword:
		return http.StatusBadRequest, false
	default:
		log.Fatal("unexpected auth check status")
	}
	return -1, false
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
