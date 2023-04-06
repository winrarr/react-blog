package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

// these routes are protected through the auth module
func AuthRoutes(router *gin.Engine) {
	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)
	router.GET("/oauth2", controllers.Oauth2)
	router.GET("/logout", controllers.Logout)
	router.GET("/refresh", controllers.Refresh)
}
