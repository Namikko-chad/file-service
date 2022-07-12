package routes

import (
	"file-service/app/models"
	"file-service/app/storages"
	"file-service/app/types"
	"file-service/app/utils"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func FileRoutes(superRoute *gin.RouterGroup) {
	superRoute.GET("files", ListFiles)
	superRoute.POST("files", CreateFile)
	superRoute.GET("files/:fileId", RetrieveFile)
	superRoute.PUT("files/:fileId", UpdateFile)
	// superRoute.DELETE("files/:fileId", DeleteFiles)
	superRoute.GET("files/:fileId/info", RetrieveFileInfo)
}

func FileResponse(file *models.File) types.IFileResponse {
	return types.IFileResponse{
		ID:     file.ID,
		UserID: file.UserID,
		Name:   file.Name,
		EXT:    file.FileStorage.EXT,
		MIME:   file.FileStorage.MIME,
		Public: file.Public,
		Hash:   file.FileStorage.Hash,
	}
}

// CreateFile godoc
// @Summary Create file
// @Schemes
// @Description List of files
// @Tags files
// @Accept multipart/form-data
// @Produce json
// @Param	limit query int false "limit result in response"
// @Param	offset query int false "offset result in response"
// @Param	search query string false "search text"
// @Success 200 {object} types.IOutputPagination{result=types.IOutputPaginationResult{rows=[]types.IFileResponse}}
// @Router /files [get]
func ListFiles(c *gin.Context) {
	var payload types.IListParam
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "Validation error", err.Error()))
		return
	}
	var files []models.File
	var count int64
	request := models.DB.Preload("FileStorage").Limit(int(payload.Limit | 10)).Offset(int(payload.Offset | 0))
	if len(payload.Search) > 0 {
		request.Where("\"Files\".\"Name\" LIKE ?", "%"+payload.Search+"%")
	}
	request.Find(&files)
	request.Count(&count)
	ResArray := make([]interface{}, len(files))
	for i, file := range files {
		ResArray[i] = FileResponse(&file)
	}
	c.JSON(http.StatusOK, types.IOutputPagination{
		Ok: true,
		Result: types.IOutputPaginationResult{
			Count: count,
			Rows:  ResArray,
		},
	})
}

func CreateFile(c *gin.Context) {
	var payload types.IFileUpload
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "Validation error", err.Error()))
		return
	}
	uploadedFile, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
		return
	}
	openedFile, err := uploadedFile.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
		return
	}
	fileData, err := ioutil.ReadAll(openedFile)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
		return
	}
	fileStorage, err := storages.StorageType.SaveFile(storages.DB, storages.FileFormData{
		Filename: uploadedFile.Filename,
		Headers:  uploadedFile.Header,
		Payload:  fileData,
	})
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
		return
	}
	file := models.File{
		ID:            uuid.New(),
		FileStorageID: fileStorage.ID,
		UserID:        uuid.New(),
		Name:          filepath.Base(uploadedFile.Filename)[:len(uploadedFile.Filename)-len(filepath.Ext(uploadedFile.Filename))],
		Public:        payload.Public || false,
	}
	models.DB.Create(&file)
	if err := models.DB.Preload("FileStorage").Where("id = ?", file.ID).First(&file).Error; err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
	}
	c.JSON(http.StatusOK, types.IOutputOk{
		Ok:     true,
		Result: FileResponse(&file),
	})
}

func UpdateFile(c *gin.Context) {
	var payload types.IFileEdit
	if err := c.ShouldBind(&payload); err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "Validation error", err.Error()))
		return
	}
	var file models.File
	if err := models.DB.Where("id = ?", c.Param("fileId")).First(&file).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.GetError(404000, "File not found", c.Param("fileId")))
		return
	}
	uploadedFile, err := c.FormFile("file")
	if err == nil {
		openedFile, err := uploadedFile.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
			return
		}
		fileData, err := ioutil.ReadAll(openedFile)
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
			return
		}
		fileStorage, err := storages.StorageType.SaveFile(storages.DB, storages.FileFormData{
			Filename: uploadedFile.Filename,
			Headers:  uploadedFile.Header,
			Payload:  fileData,
		})
		if err != nil {
			c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
			return
		}
		file.FileStorageID = fileStorage.ID
	}
	file.Public = payload.Public
	file.Name = payload.Name
	models.DB.Save(&file)
	if err := models.DB.Preload("FileStorage").Where("id = ?", file.ID).First(&file).Error; err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "File not uploaded", err.Error()))
	}
	c.JSON(http.StatusOK, types.IOutputOk{
		Ok:     true,
		Result: FileResponse(&file),
	})
}

func RetrieveFile(c *gin.Context) {
	var file models.File
	if err := models.DB.Where("id = ?", c.Param("fileId")).Preload("FileStorage").First(&file).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.GetError(404000, "File not found", c.Param("fileId")))
		return
	}
	c.Header("Accept-Ranges", "bytes")
	c.Header("Content-Type", file.FileStorage.MIME)
	c.Header("Content-Disposition", "attachment; filename*=UTF-8''"+file.Name+"."+file.FileStorage.EXT)
	c.Header("Cache-Control", "no-cache")
	c.Header("Content-Length", strconv.Itoa(len(file.FileStorage.Data)))
	c.Data(http.StatusOK, file.FileStorage.MIME, file.FileStorage.Data)
}

func RetrieveFileInfo(c *gin.Context) {
	var file models.File
	if err := models.DB.Where("id = ?", c.Param("fileId")).Preload("FileStorage").First(&file).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.GetError(404000, "File not found", c.Param("fileId")))
		return
	}
	c.JSON(http.StatusOK, types.IOutputOk{
		Ok:     true,
		Result: FileResponse(&file),
	})
}
