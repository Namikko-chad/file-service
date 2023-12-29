package handlers

import (
	"errors"
	"file-service/app/auth"
	"file-service/app/types"
	"file-service/app/utils"

	"github.com/gin-gonic/gin"
)

// ListFile godoc
// @Summary  List of files
// @Schemes
// @Description  List of files
// @Tags         files
// @Param        limit   query  int     false  "limit result in response"
// @Param        offset  query  int     false  "offset result in response"
// @Param        search  query  string  false  "search text"
// @Param        order   query  string  false  "search text"
// @Param        from    query  string  false  "search text"
// @Param        to      query  string  false  "search text"
// @Produce      json
// @Success      200  {object}  types.IOutputPagination{result=types.IOutputPaginationResult{rows=[]FileResponse}}
// @Router       /files [get]
func (h *Handlers) ListFile(c *gin.Context) {
	var payload types.IListParam
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	claims, ex := c.Get("claims")
	if !ex {
		utils.OutputError(c, 403000, "File is private", errors.New("file is private"))
		return
	}
	userId := claims.(auth.Claims).UserID
	fileUsers, count, err := h.service.ListFile(userId, payload);
	if err != nil {
		utils.OutputError(c, 403000, "File is private", errors.New("file is private"))
		return
	}

	ResArray := make([]interface{}, len(fileUsers))
	for i, fileUser := range fileUsers {
		ResArray[i] = fileResponse(&fileUser)
	}
	utils.OutputPagination(c, count, ResArray)
}