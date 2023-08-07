package storage

import (
	"file-service/app/db/models"
)

type IStorage interface {
	SaveFile(file models.File, data []byte) error
	LoadFile(fileId string) ([]byte, error)
	DeleteFile(fileId string) error
}
