package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {
	router.GET("/refresh", controllers.Refresh)
}
