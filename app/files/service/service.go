package service

import (
	"file-service/app/files/repositories"
	"file-service/app/storage"

	"gorm.io/gorm"
)

type Service struct {
	db           *gorm.DB
	repositories *repositories.Repositories
	storage      *storage.Storage
}

func New(db *gorm.DB) (*Service, error) {
	repositories, err := repositories.New(db)
	if err != nil {
		return nil, err
	}
	return &Service{
		db:           db,
		repositories: repositories,
		storage:      storage,
	}, nil
}
