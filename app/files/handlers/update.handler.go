package handlers

import (
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UpdateFile godoc
// @Summary  Update file
// @Schemes
// @Description  Update file
// @Tags         files
// @Param        fileId   param  uuid     true  "FileId"
// @Produce      json
// @Success      200  {object}  types.IOutputEmpty
// @Router       /files/:fileId [put]
func (h *Handlers) UpdateFile(c *gin.Context) {
	var payload IFileEdit
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	fileUser, err := h.repositories.FileUser.Retrieve(uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	if fileUser.UserId != userId {
		utils.OutputError(c, 403000, "File is private", err.Error())
		return
	}
	fileUser.Public = payload.Public
	fileUser.Name = payload.Name
	h.repositories.FileUser.Update(&fileUser)
	utils.OutputEmpty(c)
}
