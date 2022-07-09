package routes

import (
	"crypto/md5"
	"encoding/hex"
	"file-service/app/models"
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
	superRoute.GET("files", utils.AuthorizeJWT(ListFiles))
	superRoute.POST("files", CreateFiles)
	superRoute.GET("files/:fileId", RetrieveFiles)
	// superRoute.PUT("files/:fileId", UpdateFiles)
	// superRoute.DELETE("files/:fileId", DeleteFiles)
	superRoute.GET("files/:fileId/info", RetrieveFilesInfo)
}

func FileResponse(file models.File) types.IFileResponse {
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
		ResArray[i] = FileResponse(file)
	}
	c.JSON(http.StatusOK, types.IOutputPagination{
		Ok: true,
		Result: types.IOutputPaginationResult{
			Count: count,
			Rows:  ResArray,
		},
	})
}

func CreateFiles(c *gin.Context) {
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
	file := utils.FileUtils.Save(utils.FileCreate{
		Data: fileData,
		UserId: uuid.New(),
		Filename: uploadedFile.Filename,
		Public: payload.Public,
	})
	
	c.JSON(http.StatusOK, types.IOutputOk{
		Ok:     true,
		Result: FileResponse(file),
	})
}

func RetrieveFiles(c *gin.Context) {
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

func UpdateFiles(c *gin.Context) {
	var params types.IListParam
	if err := c.ShouldBind(&params); err != nil {
		c.JSON(http.StatusBadRequest, utils.GetError(400000, "Validation error", err.Error()))
		return
	}
	var file models.File
	if err := models.DB.Where("id = ?", c.Param("fileId")).Preload("FileStorage").First(&file).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.GetError(404000, "File not found", c.Param("fileId")))
		return
	}

}

func RetrieveFilesInfo(c *gin.Context) {
	var file models.File
	if err := models.DB.Where("id = ?", c.Param("fileId")).Preload("FileStorage").First(&file).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.GetError(404000, "File not found", c.Param("fileId")))
		return
	}
	c.JSON(http.StatusOK, types.IOutputOk{
		Ok:     true,
		Result: FileResponse(file),
	})
}
