package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {
	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)
	router.GET("/refresh", controllers.Refresh)
}
