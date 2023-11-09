package files

import (
	"file-service/app/database"
	models "file-service/app/files/models"
	"file-service/app/types"
	"file-service/app/utils"
	"fmt"
	"io"

	// "io/ioutil"

	// "net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func fileResponse(fileUser *models.FileUser) IFileResponse {
	return IFileResponse{
		ID:     fileUser.Id,
		UserID: fileUser.UserId,
		Name:   fileUser.Name,
		EXT:    fileUser.File.EXT,
		MIME:   fileUser.File.MIME,
		Public: fileUser.Public,
		Hash:   fileUser.File.Hash,
	}
}

var userId, _ = uuid.Parse("f00c03e4-2c90-4a85-8531-55bfcbb22127")

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
// @Success      200  {object}  types.IOutputPagination{result=types.IOutputPaginationResult{rows=[]types.IFileResponse}}
// @Router       /files [get]
func (h *FilesPackage) ListFile(c *gin.Context) {
	var payload types.IListParam
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	fileUsers, count, err := h.repositories.FileUser.List(userId, payload)
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

// CreateFile godoc
// @Summary  Create file
// @Schemes
// @Description  create file
// @Tags         files
// @Accept       multipart/form-data
// @Param        public  body  bool  false  "Public file"
// @Produce      json
// @Success      200  {object}  types.IOutputOk{result=types.IFileResponse}
// @Failure      400  {object}  types.IOutputError
// @Router       /files [post]
func (h *FilesPackage) CreateFile(c *gin.Context) {
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
	fileData, err := io.ReadAll(openedFile)
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	// FIXME repair interface
	fmt.Print(fileData)
	// file, err := storage.IStorage.SaveFile(storage.DB, storage.FileFormData{
	// 	Filename: uploadedFile.Filename,
	// 	Headers:  uploadedFile.Header,
	// 	Payload:  fileData,
	// })
	file := models.File{
		AbstractModel: database.AbstractModel{
			Id: uuid.New(),
		},
	}
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	fileUser := models.FileUser{
		AbstractModel: database.AbstractModel{
			Id: uuid.New(),
		},
		FileId: file.Id,
		UserId: userId,
		Name:   filepath.Base(uploadedFile.Filename)[:len(uploadedFile.Filename)-len(filepath.Ext(uploadedFile.Filename))],
		Public: false,
	}
	h.db.Create(&fileUser)
	if err := h.db.Preload("File").Where("id = ?", file.Id).First(&fileUser).Error; err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(&fileUser))
}

func (h *FilesPackage) RetrieveFile(c *gin.Context) {
	fileUser, err := h.repositories.FileUser.Retrieve(userId, uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Type", fileUser.File.MIME)
	c.Header("Content-Disposition", "attachment; filename*=UTF-8''"+fileUser.Name+"."+fileUser.File.EXT)
	c.Header("Cache-Control", "no-cache")
	// FIXME
	c.Header("Content-Length", strconv.Itoa(1)) //len(fileUser.File.Data)
	// c.Data(http.StatusOK, fileUser.File.MIME, fileUser.File.Data)
}

func (h *FilesPackage) RetrieveFileInfo(c *gin.Context) {
	fileUser, err := h.repositories.FileUser.Retrieve(userId, uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(&fileUser))
}

func (h *FilesPackage) UpdateFile(c *gin.Context) {
	var payload IFileEdit
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	fileUser, err := h.repositories.FileUser.Retrieve(userId, uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	fileUser.Public = payload.Public
	fileUser.Name = payload.Name
	h.db.Save(&fileUser)
	fileUser, _ = h.repositories.FileUser.Retrieve(userId, fileUser.Id)
	utils.OutputOk(c, fileResponse(&fileUser))
}

func (h *FilesPackage) DeleteFile(c *gin.Context) {
	fileUser, err := h.repositories.FileUser.Retrieve(userId, uuid.MustParse(c.Param("fileId")))
	if err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	h.repositories.FileUser.Delete(userId, fileUser.Id)
	utils.OutputEmpty(c)
}
