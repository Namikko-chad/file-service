package handlers

import (
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// DeleteFile godoc
// @Summary  Delete file
// @Schemes
// @Description  Delete file
// @Tags         files
// @Param        fileId   param  uuid     true  "FileId"
// @Produce      json
// @Success      200  {object}  types.IOutputEmpty
// @Router       /files/:fileId [delete]
func (h *Handlers) DeleteFile(c *gin.Context) {
	fileUser, err := h.repositories.FileUser.Retrieve(uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	if fileUser.UserId != userId {
		utils.OutputError(c, 403000, "File is private", err.Error())
		return
	}
	h.repositories.FileUser.Delete(fileUser.Id)
	utils.OutputEmpty(c)
}
