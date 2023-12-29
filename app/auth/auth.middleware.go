package auth

import (
	"errors"
	"file-service/app/utils"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// CheckAndSaveAccessTokenMiddleware checks user access token by bearer authorization before main handler calls.
// Also save access token claims in context.
func CheckAccessTokenMiddleware(c *gin.Context) {
	header := c.GetHeader("Authorization")
	if len(header) < 7 {
		utils.OutputError(c, 401000, "Authorization token not found", errors.New("authorization error").Error())
		return
	}
	header = header[7:]
	claims := Claims{}
	_, err := jwt.ParseWithClaims(header, &claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(AuthConfig[TokenTypeAdminAccess].Secret), nil
	})
	if err != nil {
		utils.OutputError(c, 401000, "Authorization error", err.Error())
		return
	}
	c.Set("claims", claims)
	c.Next()
}