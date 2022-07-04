package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type File struct {
	ID            uuid.UUID `gorm:"primaryKey;type:varchar(255)"`
	UserID        uuid.UUID `gorm:"not null;type:varchar(255);column:userId"`
	FileStorageID uuid.UUID `gorm:"not null;type:varchar(255);column:fileStorageId"`
	Name          string    `gorm:"type:varchar(255)"`
	Public        bool
	FileStorage   FileStorage
	gorm.Model
}
