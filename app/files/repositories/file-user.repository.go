package repositories

import (
	// "errors"
	models "file-service/app/files/models"
	"file-service/app/types"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileUserRepository struct {
	DB *gorm.DB
}

func (r *FileUserRepository) List(param types.IListParam) ([]models.FileUser, int64, error) {
	var fileUsers []models.FileUser
	var count int64
	request := r.DB.Joins("INNER JOIN \"Files\" ON \"FileUsers\".\"fileId\" = \"Files\".id")
	if len(param.Search) > 0 {
		request.Where("\"FileUsers\".\"name\" LIKE ?", "%"+param.Search+"%")
	}
	for _, query := range param.Where {
		request.Where(query)
	}
	request.Limit(int(param.Limit | 10))
	request.Offset(int(param.Offset))
	// TODO added dq query
	// request.Find(&fileUsers)
	// request.Count(&count)
	fileUsers = append(fileUsers, fileUser)
	count = 1
	return fileUsers, count, nil
}

func (r *FileUserRepository) Retrieve(fileId uuid.UUID) (models.FileUser, error) {
	// var fileUser models.FileUser
	// if err := r.DB.InnerJoins("Files").Where("id = ?", fileId).First(&fileUser).Error; err != nil {
	// 	return fileUser, err
	// }
	// if (models.FileUser{}) == fileUser {
	// 	return fileUser, errors.New("file not found")
	// }
	return fileUser, nil
}

func (r *FileUserRepository) Create(fileUser *models.FileUser) error {
	// return r.DB.Create(fileUser).Error
	return nil
}

func (r *FileUserRepository) Update(fileUser *models.FileUser) error {
	// return r.DB.Save(fileUser).Error
	return nil
}

func (r *FileUserRepository) Delete(fileId uuid.UUID) error {
	// return r.DB.Where("id = ?", fileId).Delete(&models.FileUser{}).Error
	return nil
}
