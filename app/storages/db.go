package storages

import (
	"crypto/md5"
	"encoding/hex"
	"file-service/app/models"
	"net/http"
	"path/filepath"

	"github.com/google/uuid"
)

func (st StorageType) SaveFile(fileRaw FileFormData) (*models.FileStorage, error) {
	md5 := md5.Sum(fileRaw.Payload)
	fileStorage := models.FileStorage{
		ID:      uuid.New(),
		EXT:     filepath.Ext(fileRaw.Filename)[1:],
		MIME:    http.DetectContentType(fileRaw.Payload),
		Storage: "db",
		Hash:    hex.EncodeToString(md5[:]),
		Data:    fileRaw.Payload,
	}
	models.DB.Create(&fileStorage)
	return &fileStorage, nil
}