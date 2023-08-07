package utils

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type JWTService interface {
	GenerateToken(UserId uuid.UUID) string
	ValidateToken(token string) (*jwt.Token, error)
}

type jwtConfig struct {
	secretKey string
}

func JWTAuthService() JWTService {
	return &jwtConfig{
		secretKey: "config.Config.Auth.AccessToken",
	}
}

type AuthData struct {
	UserId uuid.UUID `json:"userId"`
	jwt.StandardClaims
}

func (service *jwtConfig) GenerateToken(UserId uuid.UUID) string {
	data := &AuthData{
		UserId,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(900000)).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, data)

	//encoded string
	t, err := token.SignedString([]byte(service.secretKey))
	if err != nil {
		panic(err)
	}
	return t
}

func (service *jwtConfig) ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, isvalid := token.Method.(*jwt.SigningMethodHMAC); !isvalid {
			return nil, fmt.Errorf("invalid token, %+v", token.Header["alg"])
		}
		return []byte(service.secretKey), nil
	})
}

func AuthorizeJWT(f func(c *gin.Context)) gin.HandlerFunc {
	return func(c *gin.Context) {
		const BEARER_SCHEMA = "Bearer"
		authHeader := c.GetHeader("Authorization")
		tokenString := authHeader[len(BEARER_SCHEMA):]
		token, err := JWTAuthService().ValidateToken(tokenString)
		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			fmt.Println(claims)
		} else {
			fmt.Println(err)
			c.AbortWithStatus(http.StatusUnauthorized)
		}
	}
}
