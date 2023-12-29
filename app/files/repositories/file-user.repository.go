package repositories

import (
	"errors"
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
	request := r.DB//.InnerJoins("File")
	if len(param.Search) > 0 {
		for _, field := range param.SearchFields {
			request = request.Or(field+" LIKE ?", "%"+param.Search+"%")
		}
	}
	for _, query := range param.Where {
		request = request.Where(query)
	}
	request.Limit(int(param.Limit | 10)).Offset(int(param.Offset)).Find(&fileUsers).Count(&count)
	return fileUsers, count, nil
}

func (r *FileUserRepository) Retrieve(fileId uuid.UUID) (*models.FileUser, error) {
	var fileUser models.FileUser
	if err := r.DB.InnerJoins("File").Where("\"FileUsers\".id = ?", fileId).First(&fileUser).Error; err != nil {
		return nil, err
	}
	if (models.FileUser{}) == fileUser {
		return nil, errors.New("file not found")
	}
	return &fileUser, nil
}

func (r *FileUserRepository) Find(fileUser *models.FileUser) (*[]models.FileUser, error) {
	var fileUsers []models.FileUser
	if err := r.DB.Where(fileUser).Find(&fileUsers).Error; err != nil {
		return nil, err
	}
	return &fileUsers, nil
}

func (r *FileUserRepository) Create(fileUser *models.FileUser) error {
	return r.DB.Create(fileUser).Error
}

func (r *FileUserRepository) FindOrCreate(clause *models.FileUser, fileUser *models.FileUser) (*models.FileUser, error) {
	files, err := r.Find(clause)
	if err != nil {
		return nil, err
	}
	if len(*files) > 0 {
		return &(*files)[0], nil
	}
	err = r.Create(fileUser)
	if err != nil {
		return nil, err
	}
	return fileUser, nil
}

func (r *FileUserRepository) Update(fileUser *models.FileUser) error {
	return r.DB.Save(fileUser).Error
}

func (r *FileUserRepository) Delete(fileId uuid.UUID) error {
	return r.DB.Where("id = ?", fileId).Delete(&models.FileUser{}).Error
}
