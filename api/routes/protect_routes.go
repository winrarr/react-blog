package routes

import (
	"api/auth"
	"api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func protect(handle func(*gin.Context, string), requiredUserLevel models.UserLevel) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("accessToken")
		if err != nil {
			c.AbortWithStatus(http.StatusForbidden)
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
