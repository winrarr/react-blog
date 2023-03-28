package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

// there routes are protected through the auth module
func AuthRoutes(router *gin.Engine) {
	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)
	router.GET("/logout", controllers.Logout)
	router.GET("/refresh", controllers.Refresh)
}
