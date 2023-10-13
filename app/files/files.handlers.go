package files

import (
	db "file-service/app/database"
	files "file-service/app/files/models"
	models "file-service/app/files/models"
	"file-service/app/types"
	"file-service/app/utils"

	// "io/ioutil"

	// "net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func fileResponse(fileUser *models.FileUser) IFileResponse {
	return IFileResponse{
		ID:     fileUser.ID,
		UserID: fileUser.UserID,
		Name:   fileUser.Name,
		EXT:    fileUser.File.EXT,
		MIME:   fileUser.File.MIME,
		Public: fileUser.Public,
		Hash:   fileUser.File.Hash,
	}
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
func CreateFile(c *gin.Context) {
	var payload IFileUpload
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	uploadedFile, err := c.FormFile("file")
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	// openedFile, err := uploadedFile.Open()
	// if err != nil {
	// 	utils.OutputError(c, 400000, "File not uploaded", err.Error())
	// 	return
	// }
	// fileData, err := ioutil.ReadAll(openedFile)
	// if err != nil {
	// 	utils.OutputError(c, 400000, "File not uploaded", err.Error())
	// 	return
	// }
	// FIXME repair interface
	// file, err := storage.IStorage.SaveFile(storage.DB, storage.FileFormData{
	// 	Filename: uploadedFile.Filename,
	// 	Headers:  uploadedFile.Header,
	// 	Payload:  fileData,
	// })
	file := files.File{
		ID: uuid.UUID{},
	}
	if err != nil {
		utils.OutputError(c, 400000, "File not uploaded", err.Error())
		return
	}
	fileUser := models.FileUser{
		ID:     uuid.New(),
		FileID: file.ID,
		UserID: uuid.New(),
		Name:   filepath.Base(uploadedFile.Filename)[:len(uploadedFile.Filename)-len(filepath.Ext(uploadedFile.Filename))],
		Public: payload.Public || false,
	}
	db.DB.Create(&fileUser)
	if err := db.DB.Preload("File").Where("id = ?", file.ID).First(&fileUser).Error; err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(&fileUser))
}

func UpdateFile(c *gin.Context) {
	var payload IFileEdit
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	var fileUser models.FileUser
	if err := db.DB.Where("id = ?", c.Param("fileId")).First(&fileUser).Error; err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	fileUser.Public = payload.Public
	fileUser.Name = payload.Name
	db.DB.Save(&fileUser)
	if err := db.DB.Preload("File").Where("id = ?", fileUser.ID).First(&fileUser).Error; err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(&fileUser))
}

func DeleteFile(c *gin.Context) {
	var fileUser models.FileUser
	if err := db.DB.Where("id = ?", c.Param("fileId")).First(&fileUser).Error; err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	db.DB.Delete(&fileUser)
	utils.OutputEmpty(c)
}

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
func ListFile(c *gin.Context) {
	var payload types.IListParam
	if err := c.ShouldBind(&payload); err != nil {
		utils.OutputError(c, 400000, "Validation error", err.Error())
		return
	}
	var files []models.FileUser
	var count int64
	request := db.DB.Preload("File").Limit(int(payload.Limit | 10)).Offset(int(payload.Offset))
	if len(payload.Search) > 0 {
		request.Where("\"Files\".\"Name\" LIKE ?", "%"+payload.Search+"%")
	}
	request.Find(&files)
	request.Count(&count)
	ResArray := make([]interface{}, len(files))
	for i, fileUser := range files {
		ResArray[i] = fileResponse(&fileUser)
	}
	utils.OutputPagination(c, count, ResArray)
}

func RetrieveFile(c *gin.Context) {
	var fileUser models.FileUser
	if err := db.DB.Where("id = ?", c.Param("fileId")).Preload("File").First(&fileUser).Error; err != nil {
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

func RetrieveFileInfo(c *gin.Context) {
	var fileUser models.FileUser
	if err := db.DB.Where("id = ?", c.Param("fileId")).Preload("File").First(&fileUser).Error; err != nil {
		utils.OutputError(c, 404000, "File not found", err.Error())
		return
	}
	utils.OutputOk(c, fileResponse(&fileUser))
}
