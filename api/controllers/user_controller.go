package controllers

import (
	"api/database"
	"api/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	database.UserCollection.Drop(ctx)
}

// GET /users
func GetAllUsers(c *gin.Context) {
	var users []models.DBUser

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	results, err := database.UserCollection.Find(ctx, bson.M{})
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
