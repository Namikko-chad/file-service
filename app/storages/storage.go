package storages

import (
	"file-service/app/models"
)

type StorageType string

const(
	DB = "db"
	FOLDER = "folder"
)

type FileFormData struct {
	Filename string
	Headers  interface{}
	Payload  []byte
}

type Storage interface {
	SaveFile(file FileFormData) (models.File, error)
	LoadFile(fileId string) (models.File, error)
	DeleteFile(fileId string) (bool, error)
}
