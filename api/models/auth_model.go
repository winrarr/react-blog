package models

type Auth struct {
	AccessToken  string
	RefreshToken string
	UserLevel    UserLevel
}
