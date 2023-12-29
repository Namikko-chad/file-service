package auth

import (
	"file-service/app/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func (h *Handlers) Generate(c *gin.Context) {
	type JwtPayloadDTO struct {
		UserID      string `json:"userId" form:"userId" binding:"omitempty,uuid"`
		FileID      string `json:"fileId" form:"fileId" binding:"omitempty,uuid"`
	}
	var params JWTParams
	if err := c.ShouldBindUri(&params); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	var payload JwtPayloadDTO
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	userId, _ := uuid.Parse(payload.UserID)
	fileId, _ := uuid.Parse(payload.FileID)
	claims := &Claims{
		UserID: userId,
		FileID: fileId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString([]byte(AuthConfig[TokenTypeAdminAccess].Secret))
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		utils.OutputError(c, 500000, "Error generating token", err.Error())
		return
	}
	tokenRes := JwtResponse{
		Token: tokenString,
	}

	utils.OutputOk(c, tokenRes)
}
