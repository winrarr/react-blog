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
	database.BlogCollection.Drop(ctx)
}

// GET /blogs
func GetAllBlogs(c *gin.Context) {
	var blogs []models.Blog

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	results, err := database.BlogCollection.Find(ctx, bson.M{})
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	defer results.Close(ctx)
	for results.Next(ctx) {
		var blog models.Blog
		if err = results.Decode(&blog); err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		blogs = append(blogs, blog)
	}

	c.IndentedJSON(http.StatusOK, blogs)
}

// POST /newblog
func NewBlog(c *gin.Context) {
	// bind request to model
	var blog models.Blog
	if err := c.Bind(&blog); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := database.BlogCollection.InsertOne(ctx, blog)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusCreated)
}
