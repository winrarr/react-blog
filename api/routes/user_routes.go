package routes

import (
	"api/controllers"
	"api/middleware"
	"api/models"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.Engine) {
	router.Use(middleware.Authenticate(models.User))
	router.GET("/users", controllers.GetAllUsers)
}
