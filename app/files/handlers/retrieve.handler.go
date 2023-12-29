package handlers

import (
	"errors"
	"file-service/app/auth"
	"file-service/app/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RetrieveFileInfo godoc
// @Summary  Retrieve file
// @Schemes
// @Description  Retrieve file
// @Tags         files
// @Param        fileId   path  string     true  "FileId"
// @Success      200
// @Router       /files/:fileId [get]
func (h *Handlers) RetrieveFile(c *gin.Context) {
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
	data, err := h.service.RetrieveFile(userId, fileId)
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Type", fileUser.File.MIME)
	c.Header("Content-Disposition", "attachment; filename*=UTF-8''"+fileUser.Name+"."+fileUser.File.EXT)
	c.Header("Cache-Control", "no-cache")
	c.Header("Content-Length", strconv.Itoa(int(fileUser.File.Size)))
	c.Data(http.StatusOK, fileUser.File.MIME, data)
}
