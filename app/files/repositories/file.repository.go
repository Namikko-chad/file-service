package repositories

import (
	"errors"
	models "file-service/app/files/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileRepository struct {
	DB *gorm.DB
}

func (r *FileRepository) Create (file *models.File) (*models.File, error) {
	r.DB.Create(file)
	return file, r.DB.Error
}

func (r *FileRepository) Retrieve (fileId uuid.UUID) (*models.File, error) {
	var file models.File
	if err := r.DB.Where("id = ?", fileId).First(&file).Error; err != nil {
		return nil, err
	}
	if (models.File{}) == file {
		return nil, errors.New("file not found")
	}
	return &file, nil
}

func (r *FileRepository) Update (file *models.File) (*models.File, error) {
	r.DB.Save(file)
	return file, r.DB.Error
}

func (r *FileRepository) Delete (fileId uuid.UUID) error {
	return r.DB.Where("id = ?", fileId).Delete(&models.File{}).Error
}
