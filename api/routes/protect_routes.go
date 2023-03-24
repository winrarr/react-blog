package routes

import (
	"api/auth"
	"api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func protect(handle gin.HandlerFunc, requiredUserLevel models.UserLevel) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !auth.VerifyAccessToken(c.Request.Header.Get("Authorization"), requiredUserLevel) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		handle(c)
	}
}
