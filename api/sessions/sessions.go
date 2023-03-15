package sessions

import (
	"api/models"
	"time"

	"github.com/google/uuid"
)

type sessionInfo struct {
	expires   time.Time
	userLevel models.UserLevel
}

var sessions = map[string]sessionInfo{}

func NewSession(userLevel models.UserLevel) string {
	sessionToken := uuid.NewString()
	sessions[sessionToken] = sessionInfo{
		time.Now(),
		userLevel,
	}
	return sessionToken
}

// func Authenticate(c *gin.Context) {
// 	sessionCookie, err := c.Request.Cookie("session_token")
// 	if err != nil {
// 		c.AbortWithStatus(http.StatusUnauthorized)
// 		println("session cookie was not found")
// 		return
// 	}

// 	val, ok := sessions[sessionCookie.Value]
// 	if !ok {
// 		c.AbortWithStatus(http.StatusUnauthorized)
// 		println("hej2")
// 		return
// 	}

// 	expires := val.Add(2 * time.Minute)
// 	if expires.Before(time.Now()) {
// 		c.AbortWithStatus(440)
// 	}
// }
