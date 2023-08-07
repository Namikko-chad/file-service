package database

import (
	"file-service/app/db"
	"file-service/app/db/models"
	"file-service/app/storage"

	"github.com/google/uuid"
)

type DBStorage struct {
	storage .IStorage
}

func init() {
	db.DB.AutoMigrate(&Storage{})
}

func (st DBStorage) SaveFile(file models.File, data []byte) error {
	storage := Storage{
		FileId: file.ID,
		Data:   data,
	}
	db.DB.Create(&storage)
	return nil
}

func (st DBStorage) LoadFile(fileId uuid.UUID) ([]byte, error) {
	var stor Storage
	if err := db.DB.Where("id = ?", fileId).Preload("Storage").First(&stor).Error; err != nil {
		return nil, err
	}
	return stor.Data, nil
}

func (st DBStorage) DeleteFile(fileId uuid.UUID) error {
	if err := db.DB.Delete("id = ?", fileId).Preload("Storage").Error; err != nil {
		return err
	}
	return nil
}
