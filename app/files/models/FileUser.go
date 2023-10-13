package files

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileUser struct {
	ID     uuid.UUID `gorm:"primaryKey;type:varchar(255)"`
	UserID uuid.UUID `gorm:"not null;type:varchar(255);column:userId"`
	FileID uuid.UUID `gorm:"not null;type:varchar(255);column:fileId"`
	Name   string    `gorm:"type:varchar(255)"`
	Public bool
	File   *File
	gorm.Model
}
