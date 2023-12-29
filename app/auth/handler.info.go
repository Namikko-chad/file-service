package auth

import (
	"file-service/app/utils"
	"github.com/gin-gonic/gin"
	// "github.com/google/uuid"
)

func (h *Handlers) Info(c *gin.Context) {
	payload := c.Keys["claims"].(Claims)
	utils.OutputOk(c, payload)
}
