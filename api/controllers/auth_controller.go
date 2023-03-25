package controllers

import (
	"api/auth"
	"api/database"
	"api/models"
	"api/utils"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func init() {
	createAdminUser("a", "a")
}

func createAdminUser(username string, password string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	database.UserCollection.Drop(ctx)
	bytes, _ := bcrypt.GenerateFromPassword([]byte("a"), bcrypt.DefaultCost)
	refreshTokenExp := models.RefreshTokenExp{
		Token:     "",
		ExpiresAt: 0,
	}
	user := models.DBUser{
		Username:        "a",
		HSPassword:      bytes,
		UserLevel:       models.Admin,
		RefreshTokenExp: refreshTokenExp,
	}
	database.UserCollection.InsertOne(ctx, user)
}

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

	auth, status := auth.FindUser(credentials.Username, credentials.Password)
	httpStatus, authed := utils.CheckStatusToHttpStatus(status)

	if authed {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func sendAuth(authObj *models.Auth, httpStatus int, c *gin.Context) {
	c.SetCookie("refreshToken", authObj.RefreshToken, int(auth.RefreshTokenExpirationTime), "/", "localhost", true, true)

	authResponse := models.AuthResponse{
		AccessToken: authObj.AccessToken,
	}

	c.JSON(httpStatus, authResponse)
}

// GET /logout
func Logout(c *gin.Context) {

}

// GET /refresh
func Refresh(c *gin.Context) {
	tokenString, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	auth, status := auth.RefreshAccessToken(tokenString)
	httpStatus, authed := utils.RefreshStatusToHttpStatus(status)

	if authed {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}
