package repositories

import (
	"errors"
	models "file-service/app/files/models"
	"file-service/app/types"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileUserRepository struct {
	DB *gorm.DB
}

func (r *FileUserRepository) List(userId uuid.UUID, param types.IListParam) ([]models.FileUser, int64, error) {
	var fileUsers []models.FileUser
	var count int64
	fmt.Print(param.Limit)
	fmt.Print(int(param.Limit | 10))
	request := r.DB.Model(models.FileUser{})
	request.
	if len(param.Search) > 0 {
		request.Where("\"FileUsers\".\"name\" LIKE ?", "%"+param.Search+"%")
	}
	request.Where("\"FileUsers\".\"userId\" = ?", userId)
	request.Limit(int(param.Limit | 10))
	request.Offset(int(param.Offset))
	request.Find(&fileUsers)
	request.Count(&count)
	return fileUsers, count, nil
}

func (r *FileUserRepository) Retrieve(userId uuid.UUID, fileId uuid.UUID) (models.FileUser, error) {
	var fileUser models.FileUser
	if err := r.DB.InnerJoins("Files").Where("id = ?", fileId).First(&fileUser).Error; err != nil {
		return fileUser, err
	}
	if (models.FileUser{}) == fileUser {
		return fileUser, errors.New("file not found")
	}
	return fileUser, nil
}

func (r *FileUserRepository) Create(userId uuid.UUID, fileUser *models.FileUser) error {
	return r.DB.Create(fileUser).Error
}

func (r *FileUserRepository) Update(userId uuid.UUID, fileUser *models.FileUser) error {
	return r.DB.Save(fileUser).Error
}

func (r *FileUserRepository) Delete(userId uuid.UUID, fileId uuid.UUID) error {
	return r.DB.Where("id = ?", fileId).Delete(&models.FileUser{}).Error
}
