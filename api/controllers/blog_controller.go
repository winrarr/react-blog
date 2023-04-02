package controllers

import (
	"api/database"
	"api/models"
	"context"
	"net/http"
	"time"

	"github.com/davecgh/go-spew/spew"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// func init() {
// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()
// 	database.BlogCollection.Drop(ctx)
// }

// GET /blogs
func GetBlogs(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	results, err := database.BlogCollection.Find(ctx, bson.M{}, options.Find().SetLimit(10))
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	defer results.Close(ctx)

	var blogs []models.Blog
	err = results.All(ctx, &blogs)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
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
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// check if user already exists
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, _ := database.BlogCollection.DeleteOne(ctx, bson.M{"_id": id})
	if result.DeletedCount != 1 {
		c.AbortWithStatus(http.StatusBadRequest)
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

	result, err := database.BlogCollection.UpdateByID(ctx, primitive.ObjectIDFromHex(blog.ID), blog)
	spew.Dump(err)
	if result.MatchedCount == 0 || result.ModifiedCount != 1 {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	c.Status(http.StatusOK)
}
