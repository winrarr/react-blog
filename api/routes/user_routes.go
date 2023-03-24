package routes

import (
	"api/controllers"
	"api/models"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.Engine) {
	router.GET("/users", protect(controllers.GetAllUsers, models.Admin)...)
}
