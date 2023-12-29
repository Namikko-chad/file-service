package repositories

import (
	"gorm.io/gorm"
)

type Repositories struct {
	FileUser FileUserRepository
}

func New(db *gorm.DB) (*Repositories, error) {
	return &Repositories{
		FileUser: FileUserRepository{
			DB: db,
		},
	}, nil
}
