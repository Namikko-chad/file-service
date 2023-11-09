package repositories

import "gorm.io/gorm"

type Repositories struct {
	File     FileRepository
	FileUser FileUserRepository
}

func New(db *gorm.DB) (*Repositories, error) {
	return &Repositories{
		File: FileRepository{
			DB: db,
		},
		FileUser: FileUserRepository{
			DB: db,
		},
	}, nil

}
