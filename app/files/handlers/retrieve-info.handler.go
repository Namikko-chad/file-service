package handlers

import (
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RetrieveFileInfo godoc
// @Summary  Retrieve file
// @Schemes
// @Description  Retrieve file info
// @Tags         files
// @Param        fileId   param  uuid     true  "FileId"
// @Produce      json
// @Success      200  {object}  types.IOutputOk{result=IFileResponse}
// @Router       /files/:fileId/info [get]
func (h *Handlers) RetrieveFileInfo(c *gin.Context) {
	fileUser, err := h.repositories.FileUser.Retrieve(uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	if fileUser.UserId != userId {
		utils.OutputError(c, 403000, "File is private", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(&fileUser))
}
