package models

type UserLevel string

const (
	Guest UserLevel = "0"
	User  UserLevel = "1"
	Admin UserLevel = "2"
)

type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}

type DBUser struct {
	Username     string
	HSPassword   []byte
	UserLevel    UserLevel
	RefreshToken RefreshToken
}
