package handlers

import (
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
// @Success      200  {object}  types.IOutputPagination{result=types.IOutputPaginationResult{rows=[]IFileResponse}}
// @Router       /files [get]
func (h *Handlers) ListFile(c *gin.Context) {
	var payload types.IListParam
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	payload.Where = append(payload.Where, "\"FileUsers\".\"userId\" = '"+ userId.String() +"'")
	fileUsers, count, err := h.repositories.FileUser.List(payload)
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	ResArray := make([]interface{}, len(fileUsers))
	for i, fileUser := range fileUsers {
		ResArray[i] = fileResponse(&fileUser)
	}
	utils.OutputPagination(c, count, ResArray)
}