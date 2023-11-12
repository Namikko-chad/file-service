package handlers

import (
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
// @Param        fileId   param  uuid     true  "FileId"
// @Success      200  {bytes}
// @Router       /files/:fileId [get]
func (h *Handlers) RetrieveFile(c *gin.Context) {
	fileUser, err := h.repositories.FileUser.Retrieve(uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	if fileUser.UserId != userId {
		utils.OutputError(c, 403000, "File is private", err.Error())
		return
	}
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Type", fileUser.File.MIME)
	c.Header("Content-Disposition", "attachment; filename*=UTF-8''"+fileUser.Name+"."+fileUser.File.EXT)
	c.Header("Cache-Control", "no-cache")
	c.Header("Content-Length", strconv.Itoa(int(fileUser.File.Size)))
	c.Data(http.StatusOK, fileUser.File.MIME, []byte{})
}
