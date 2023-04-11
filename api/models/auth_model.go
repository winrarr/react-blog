package models

// internal
type UserLevel int

const (
	Guest UserLevel = iota
	Standard
	Admin
)

type TokenExp struct {
	Token     string
	ExpiresAt int64
}

type AuthInfo struct {
	RefreshToken TokenExp
	AccessToken  TokenExp
	UserLevel    UserLevel
}

// database
type User struct {
	Username        string `bson:"_id,omitempty"`
	HSPassword      []byte
	UserLevel       UserLevel
	RefreshTokenExp TokenExp
}

// request
type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}

// response
type LoginResponse struct {
	UserLevel UserLevel `json:"userLevel"`
}

type Oauth2Response struct {
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	UserLevel UserLevel `json:"userLevel"`
}
