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
	"google.golang.org/api/idtoken"
)

func init() {
	// createAdminUser("a", "a")
}

func createAdminUser(username string, password string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	database.UserCollection.Drop(ctx)
	bytes, _ := bcrypt.GenerateFromPassword([]byte("a"), bcrypt.DefaultCost)
	refreshTokenExp := models.TokenExp{
		Token:     "",
		ExpiresAt: 0,
	}
	user := models.User{
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

	auth, status := auth.Signup(credentials.Username, credentials.Password)
	httpStatus, ok := utils.CreateStatusToHttpStatus(status)

	if ok {
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

	auth, status := auth.Login(credentials.Username, credentials.Password)
	httpStatus, ok := utils.CheckStatusToHttpStatus(status)

	if ok {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

func sendAuth(authObj *models.Auth, httpStatus int, c *gin.Context) {
	c.SetCookie("refreshToken", authObj.RefreshToken, int(auth.RefreshTokenExpTime), "/", "localhost", true, true)
	c.SetCookie("accessToken", authObj.AccessToken, int(auth.AccessTokenExpTime), "/", "localhost", true, true)
	c.JSON(httpStatus, authObj.UserLevel)
}

// GET /logout
func Logout(c *gin.Context) {
	tokenString, err := c.Cookie("accessToken")
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	status := auth.Logout(tokenString)
	httpStatus, ok := utils.LogoutStatusToHttpStatus(status)

	if ok {
		c.Status(http.StatusOK)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// GET /refresh
func Refresh(c *gin.Context) {
	tokenString, err := c.Cookie("refreshToken")
	if err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	auth, status := auth.Refresh(tokenString)
	httpStatus, ok := utils.RefreshStatusToHttpStatus(status)

	if ok {
		sendAuth(auth, httpStatus, c)
	} else {
		c.AbortWithStatus(httpStatus)
	}
}

// GET /oauth2
func Oauth2(c *gin.Context) {
	token := c.Query("token")

	if token == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	payload, err := idtoken.Validate(context.Background(), token, "159781938590-0nivkjv9f0iscnm9nvdsa9h4c3hl4hl8.apps.googleusercontent.com")
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	userInfo := models.UserInfo{
		Email:     payload.Claims["email"].(string),
		Name:      payload.Claims["given_name"].(string) + payload.Claims["family_name"].(string),
		UserLevel: models.Standard,
	}

	refreshTokenExp, accessTokenExp := auth.NewTokens(
		payload.Claims["given_name"].(string)+payload.Claims["family_name"].(string),
		models.Standard,
	)

	c.SetCookie("refreshToken", refreshTokenExp.Token, int(auth.RefreshTokenExpTime), "/", "localhost", true, true)
	c.SetCookie("accessToken", accessTokenExp.Token, int(auth.AccessTokenExpTime), "/", "localhost", true, true)

	c.JSON(http.StatusOK, userInfo)
}
