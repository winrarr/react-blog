package models

type AuthResponse struct {
	AccessToken string    `json:"accessToken"`
	UserLevel   UserLevel `json:"userLevel"`
}
