package models

type RefreshTokenWithExpiration struct {
	Token     string
	ExpiresAt int64
}

type AccessTokenWithExpiration struct {
	Token     string
	ExpiresAt int64
}

type AuthResponse struct {
	AccessToken string    `json:"accessToken"`
	UserLevel   UserLevel `json:"userLevel"`
}
