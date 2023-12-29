package auth

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JWTParams struct {
	Token string `json:"token" uri:"tokenType" binding:"required"`
}

type JwtPayload struct {
	UserID      uuid.UUID `json:"userId" form:"userId" binding:"uuid"`
	FileID      uuid.UUID `json:"fileId" form:"fileId" binding:"uuid"`
}

type JwtResponse struct {
	Token string `json:"token"`
}

// Claims is claims of token.
type Claims struct {
	jwt.RegisteredClaims
	UserID      uuid.UUID `json:"userId"`
	FileID      uuid.UUID `json:"fileId"`
}

type TokenType string

const (
	TokenTypeAdminAccess TokenType = "admin"
	TokenTypeUserAccess  TokenType = "user"
	TokenTypeFileAccess  TokenType = "file"
)