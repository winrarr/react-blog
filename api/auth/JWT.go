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

type AccessTokenClaims struct {
	UserLevel      models.UserLevel   `json:"userLevel"`
	StandardClaims jwt.StandardClaims `json:"standardClaims"`
}

func (c AccessTokenClaims) Valid() error {
	return c.StandardClaims.Valid()
}

// expiration times

const (
	RefreshTokenExpirationTime time.Duration = time.Hour * 24
	AccessTokenExpirationTime  time.Duration = time.Minute * 2
)

func newTokens(username string, userLevel models.UserLevel) (models.RefreshTokenExp, models.AccessTokenExp) {
	return newRefreshToken(username), newAccessToken(username, userLevel)
}

func newRefreshToken(username string) models.RefreshTokenExp {
	issuedAt := time.Now()
	expiresAt := issuedAt.Add(RefreshTokenExpirationTime).Unix()
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
	return models.RefreshTokenExp{
		Token:     tokenString,
		ExpiresAt: expiresAt,
	}
}

func newAccessToken(username string, userLevel models.UserLevel) models.AccessTokenExp {
	issuedAt := time.Now()
	expiresAt := issuedAt.Add(AccessTokenExpirationTime).Unix()
	claims := AccessTokenClaims{
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
	return models.AccessTokenExp{
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

	return claims, nil
}

func ParseToken[T *jwt.Claims](tokenString string, claims T, secretName string) (T, error) {
	token, err := jwt.ParseWithClaims(tokenString, *claims, keyFunc(secretName))
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(T)
	if !ok {
		return nil, errors.New("incorrect format for claims")
	}

	return claims, nil
}

func ParseAccessToken(tokenString string) (*AccessTokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &AccessTokenClaims{}, keyFunc("ACCESS_TOKEN"))
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*AccessTokenClaims)
	if !ok {
		return nil, errors.New("incorrect format for access token claims")
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
