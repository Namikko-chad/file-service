package utils

import (
	"crypto/md5"
	"encoding/hex"
	"file-service/app/models"
	"net/http"
	"path/filepath"

	"github.com/google/uuid"
)

type FileCreate struct {
	Data     []byte
	Filename string
	UserId   uuid.UUID
	Public   bool
}

type FileUtils interface {
	Save(file FileCreate) (models.File, error)
	Load(fileId string) (models.File, error)
	Delete(fileId string) (bool, error)
}

func (fileRaw FileCreate) Save() (*models.File, error) {
	md5 := md5.Sum(fileRaw.Data)
	fileStorage := models.FileStorage{
		ID:      uuid.New(),
		EXT:     filepath.Ext(fileRaw.Filename)[1:],
		MIME:    http.DetectContentType(fileRaw.Data),
		Storage: "db",
		Hash:    hex.EncodeToString(md5[:]),
		Data:    fileRaw.Data,
	}
	file := models.File{
		ID:            uuid.New(),
		FileStorageID: fileStorage.ID,
		UserID:        fileRaw.UserId,
		Name:          filepath.Base(fileRaw.Filename)[:len(fileRaw.Filename)-len(filepath.Ext(fileRaw.Filename))],
		Public:        fileRaw.Public || false,
	}
	models.DB.Create(&fileStorage)
	models.DB.Create(&file)
	if err := models.DB.Preload("FileStorage").Where("id = ?", file.ID).First(&file).Error; err != nil {
		return nil, err
	}
	return &file, nil
}
