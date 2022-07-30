package storages

import (
	"crypto/md5"
	"encoding/hex"
	"file-service/app/db"
	"file-service/app/db/models"
	"net/http"
	"path/filepath"

	"github.com/google/uuid"
)

func (st StorageType) SaveFile(fileRaw FileFormData) (*models.File, error) {
	md5 := md5.Sum(fileRaw.Payload)
	file := models.File{
		ID:      uuid.New(),
		EXT:     filepath.Ext(fileRaw.Filename)[1:],
		MIME:    http.DetectContentType(fileRaw.Payload),
		Storage: "db",
		Hash:    hex.EncodeToString(md5[:]),
		Data:    fileRaw.Payload,
	}
	db.DB.Create(&file)
	return &file, nil
}