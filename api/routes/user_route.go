package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {
	router.POST("/signup", controllers.CreateUser)
	router.POST("/signin", controllers.Login)
	router.GET("/users", controllers.GetAllUsers)
}
