package handlers

import (
	"errors"
	"file-service/app/auth"
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RetrieveFileInfo godoc
// @Summary  Retrieve file
// @Schemes
// @Description  Retrieve file info
// @Tags         files
// @Param        fileId   path  string     true  "FileId"
// @Produce      json
// @Success      200  {object}  types.IOutputOk{result=FileResponse}
// @Router       /files/:fileId/info [get]
func (h *Handlers) RetrieveFileInfo(c *gin.Context) {
	var param FileParam
	if err := c.ShouldBindUri(&param); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	fileId := uuid.MustParse(param.ID)
	claims, claimError := c.Get("claims")
	if !claimError {
		utils.OutputError(c, 403000, "File is private", errors.New("file is private"))
		return
	}
	userId := claims.(auth.Claims).UserID
	fileUser, err := h.service.RetrieveFileInfo(userId, fileId)
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	if fileUser.UserId != userId {
		utils.OutputError(c, 403000, "File is private", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(fileUser))
}
