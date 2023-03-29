package routes

import (
	"api/controllers"
	"api/models"

	"github.com/gin-gonic/gin"
)

func BlogRoutes(router *gin.Engine) {
	router.GET("/blogs", controllers.GetAllBlogs)
	router.POST("/newblog", protect(controllers.NewBlog, models.Admin))
	router.DELETE("/deleteblog", protect(controllers.DeleteBlog, models.Admin))
	router.PUT("/editBlog", protect(controllers.EditBlog, models.Admin))
}
