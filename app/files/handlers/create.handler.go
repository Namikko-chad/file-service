package handlers

import (
	"errors"
	"file-service/app/auth"
	"file-service/app/utils"
	"io"

	"github.com/gin-gonic/gin"
)

// CreateFile godoc
// @Summary  Create file
// @Schemes
// @Description  create file
// @Tags         files
// @Accept       multipart/form-data
// @Produce      json
// @Success      200  {object}  types.IOutputOk{result=FileResponse}
// @Failure      400  {object}  types.IOutputError
// @Router       /files [post]
func (h *Handlers) CreateFile(c *gin.Context) {
	uploadedFile, err := c.FormFile("file")
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	openedFile, err := uploadedFile.Open()
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	data, err := io.ReadAll(openedFile)
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	claims, ex := c.Get("claims")
	if !ex {
		utils.OutputError(c, 403000, "File is private", errors.New("file is private"))
		return
	}
	userId := claims.(auth.Claims).UserID
	fileUser, err :=h.service.CreateFile(userId, uploadedFile.Filename, data)
	utils.OutputOk(c, fileResponse(fileUser))
}
