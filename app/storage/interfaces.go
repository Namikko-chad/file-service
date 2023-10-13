package storage

import (
	"file-service/app/files/models"
)

type IStorage interface {
	SaveFile(file files.File, data []byte) error
	LoadFile(fileId string) ([]byte, error)
	DeleteFile(fileId string) error
}
