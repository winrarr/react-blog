package middleware

import (
	"api/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

func VerifyAccessToken(c *gin.Context) {
	if !auth.VerifyAccessToken(c.Request.Header.Get("Authorization")) {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
}
