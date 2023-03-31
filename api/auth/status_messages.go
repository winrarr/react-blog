package auth

type StatusMessage int

const (
	Success StatusMessage = iota
	InternalError
	UserAlreadyExists
	UserNotFound
	IncorrectPassword
	InvalidToken
	RefreshTokenExpired
)
