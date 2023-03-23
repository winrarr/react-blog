package routes

import (
	"api/controllers"
	"api/middleware"
	"api/models"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.Engine) {
	router.GET("/users", middleware.VerifyAccessToken(models.Admin), controllers.GetAllUsers)
}
