package controllers

import (
	"api/auth"
	"api/models"
	"api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /signup
func Signup(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	auth, status := auth.NewUser(credentials.Username, credentials.Password)
	httpStatus, created := utils.CreateStatusToHttpStatus(status)

	if created {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// POST /login
func Login(c *gin.Context) {
	// bind request to model
	var credentials models.Credentials
	if err := c.Bind(&credentials); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	auth, status := auth.CheckUser(credentials.Username, credentials.Password)
	httpStatus, authed := utils.CheckStatusToHttpStatus(status)

	if authed {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func sendAuth(authObj *auth.Auth, httpStatus int, c *gin.Context) {
	c.SetCookie("refreshToken", authObj.RefreshToken, int(auth.RefreshTokenExpiresIn), "/", "localhost", true, true)

	authResponse := models.AuthResponse{
		AccessToken: authObj.AccessToken,
		UserLevel:   authObj.UserLevel,
	}
	c.JSON(httpStatus, authResponse)
}

func Refresh(c *gin.Context) {
	tokenString, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	auth, status := auth.RefreshToken(tokenString)
	httpStatus, authed := utils.CheckStatusToHttpStatus(status)

	if authed {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}
