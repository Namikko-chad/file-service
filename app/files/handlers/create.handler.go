package handlers

import (
	"file-service/app/database"
	models "file-service/app/files/models"
	"file-service/app/storage"
	"file-service/app/utils"
	"io"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateFile godoc
// @Summary  Create file
// @Schemes
// @Description  create file
// @Tags         files
// @Accept       multipart/form-data
// @Produce      json
// @Success      200  {object}  types.IOutputOk{result=types.IFileResponse}
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
	fileInfo := storage.FileInfo{
		ID:   uuid.New(),
	}
	h.storage.SaveFile(fileInfo, data)
	file := models.File{
		AbstractModel: database.AbstractModel{
			Id: fileInfo.ID,
		},
		EXT: fileInfo.EXT,
		MIME: fileInfo.MIME,
		Size: fileInfo.Size,
		Hash: fileInfo.Hash,
	}
	h.repositories.File.Create(&file)
	fileUser := models.FileUser{
		AbstractModel: database.AbstractModel{
			Id: uuid.New(),
		},
		FileId: file.Id,
		UserId: userId,
		Name:   uploadedFile.Filename,
	}
	h.repositories.FileUser.Create(&fileUser)
	utils.OutputOk(c, fileResponse(&fileUser))
}
