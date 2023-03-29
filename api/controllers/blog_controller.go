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
	id := c.Param("id")
	if id == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// delete blog from database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := database.BlogCollection.DeleteOne(ctx, bson.M{"id": id})
	if err != nil || result.DeletedCount != 1 {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusOK)
}

// PUT /editblog
func EditBlog(c *gin.Context, username string) {
	// bind request to model
	var blog models.Blog
	if err := c.Bind(&blog); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// update blog from database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := database.BlogCollection.UpdateByID(ctx, blog.ID, blog)
	if err != nil || result.ModifiedCount != 1 {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusOK)
}
