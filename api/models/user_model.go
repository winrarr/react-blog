package models

// request
type Credentials struct {
	Username string `binding:"required" json:"username"`
	Password string `binding:"required" json:"password"`
}
