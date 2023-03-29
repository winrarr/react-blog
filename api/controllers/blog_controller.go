package controllers

import (
	"api/database"
	"api/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// func init() {
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()
// 	database.BlogCollection.Drop(ctx)
// }

// GET /blogs
func GetAllBlogs(c *gin.Context) {
	var blogs []models.Blog

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	results, err := database.BlogCollection.Find(ctx, bson.M{}, options.Find().SetLimit(10))
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
func NewBlog(c *gin.Context, username string) {
	// bind request to model
	var blog models.Blog
	if err := c.Bind(&blog); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// insert new blog in database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := database.BlogCollection.InsertOne(ctx, blog)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusCreated)
}

// DELETE /deleteblog
func DeleteBlog(c *gin.Context, username string) {
	// make getblog return the id so we can use it for deletion and editing

	// bind request to model
	var blog models.Blog
	if err := c.Bind(&blog); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// delete blog from database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := database.BlogCollection.DeleteOne()
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusCreated)
}

// PUT /editblog
func EditBlog(c *gin.Context, username string) {
	// make getblog return the id so we can use it for deletion and editing

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
