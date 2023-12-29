package auth

import (
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
)

func (h *Handlers) Validate(c *gin.Context) {
	utils.OutputEmpty(c)
}