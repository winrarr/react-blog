package routes

import (
	"api/controllers"
	"api/models"

	"github.com/gin-gonic/gin"
)

func BlogRoutes(router *gin.Engine) {
	router.GET("/blogs", controllers.GetBlogs)
	router.POST("/newblog", protect(controllers.NewBlog, models.Admin))
	router.DELETE("/deleteblog/:id", protect(controllers.DeleteBlog, models.Admin))
	router.PUT("/editblog", protect(controllers.EditBlog, models.Admin))
}
