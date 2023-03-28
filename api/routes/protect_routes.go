package routes

import (
	"api/auth"
	"api/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func protect(handle func(*gin.Context, string), requiredUserLevel models.UserLevel) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		tokenString, found := strings.CutPrefix(authHeader, "Bearer ")
		if !found {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		username, ok := auth.VerifyAccessToken(tokenString, requiredUserLevel)
		if !ok {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		handle(c, username)
	}
}
