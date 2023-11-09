package files

import (
	"file-service/app/database"

	"github.com/google/uuid"
)

type FileUser struct {
	database.AbstractModel
	UserId uuid.UUID `gorm:"not null;type:uuid"`
	FileId uuid.UUID `gorm:"not null;type:uuid"`
	Name   string    `gorm:"type:varchar(255)"`
	Public bool
	// TODO add foreign key name
	File   *File
}
