package auth

import (
	"api/configs"
	"api/models"
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt"
)

// claims
type accessTokenClaims struct {
	UserLevel      models.UserLevel   `json:"userLevel"`
	StandardClaims jwt.StandardClaims `json:"standardClaims"`
}

func (c accessTokenClaims) Valid() error {
	return c.StandardClaims.Valid()
}

// expiration times
const (
	RefreshTokenExpTime time.Duration = time.Hour * 24
	AccessTokenExpTime  time.Duration = time.Minute * 10
)

func newTokens(username string, userLevel models.UserLevel) (models.TokenExp, models.TokenExp) {
	return newRefreshToken(username), newAccessToken(username, userLevel)
}

func newRefreshToken(username string) models.TokenExp {
	issuedAt := time.Now()
	expiresAt := issuedAt.Add(RefreshTokenExpTime).Unix()
	claims := jwt.StandardClaims{
		ExpiresAt: expiresAt,
		IssuedAt:  issuedAt.Unix(),
		Issuer:    "api",
		Subject:   username,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(configs.EnvSecret("REFRESH_TOKEN"))
	if err != nil {
		log.Fatal("unable to create refresh token: ", err)
	}
	return models.TokenExp{
		Token:     tokenString,
		ExpiresAt: expiresAt,
	}
}

func newAccessToken(username string, userLevel models.UserLevel) models.TokenExp {
	issuedAt := time.Now()
	expiresAt := issuedAt.Add(AccessTokenExpTime).Unix()
	claims := accessTokenClaims{
		UserLevel: userLevel,

		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt,
			IssuedAt:  issuedAt.Unix(),
			Issuer:    "api",
			Subject:   username,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(configs.EnvSecret("ACCESS_TOKEN"))
	if err != nil {
		log.Fatal("unable to create access token token: ", err)
	}
	return models.TokenExp{
		Token:     tokenString,
		ExpiresAt: expiresAt,
	}
}

func ParseRefreshToken(tokenString string) (*jwt.StandardClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, keyFunc("REFRESH_TOKEN"))
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*jwt.StandardClaims)
	if !ok {
		return nil, errors.New("incorrect format for refresh token claims")
	}

	if claims.ExpiresAt <= time.Now().Unix() {
		return nil, errors.New("token is expired")
	}

	return claims, nil
}

func ParseAccessToken(tokenString string) (*accessTokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &accessTokenClaims{}, keyFunc("ACCESS_TOKEN"))
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*accessTokenClaims)
	if !ok {
		return nil, errors.New("incorrect format for access token claims")
	}

	if claims.StandardClaims.ExpiresAt <= time.Now().Unix() {
		return nil, errors.New("token is expired")
	}

	return claims, nil
}

func keyFunc(secretName string) jwt.Keyfunc {
	return func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected jwt signing method")
		}

		return configs.EnvSecret(secretName), nil
	}
}
