package models

type UserLevel int

const (
	Guest UserLevel = iota
	User
	Admin
)

type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}

type DBUser struct {
	Username     string
	HSPassword   []byte
	UserLevel    UserLevel
	RefreshToken string
}
