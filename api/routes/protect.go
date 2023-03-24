package routes

import (
	"api/middleware"
	"api/models"

	"github.com/gin-gonic/gin"
)

func protect(handle gin.HandlerFunc, userLevel models.UserLevel) []gin.HandlerFunc {
	return []gin.HandlerFunc{middleware.Authenticate(userLevel), handle}
}
