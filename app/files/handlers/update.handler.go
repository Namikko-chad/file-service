package handlers

import (
	"errors"
	"file-service/app/auth"
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UpdateFile godoc
// @Summary  Update file
// @Schemes
// @Description  Update file
// @Tags         files
// @Param        fileId   path  string   true   "FileId"
// @Param        name     body  string   false  "Name"
// @Param        public   body  bool     false  "Public"
// @Produce      json
// @Success      200  {object}  types.IOutputEmpty
// @Router       /files/:fileId [put]
func (h *Handlers) UpdateFile(c *gin.Context) {
	var payload FileEdit
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	var param FileParam
	if err := c.ShouldBindUri(&param); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	fileId := uuid.MustParse(param.ID)
	claims, err := c.Get("claims")
	if !err {
		utils.OutputError(c, 403000, "File is private", errors.New("file is private"))
		return
	}
	userId := claims.(auth.Claims).UserID
	if err := h.service.UpdateFile(userId, fileId, payload.Name, payload.Public); err != nil {
		utils.OutputError(c, 500000, "Error updating file", err.Error())
		return
	}
	utils.OutputEmpty(c)
}
