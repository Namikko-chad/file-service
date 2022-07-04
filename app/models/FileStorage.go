package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FileStorage struct {
	ID      uuid.UUID `gorm:"primaryKey;type:varchar(255)"`
	EXT     string    `gorm:"type:varchar(10)"`
	MIME    string    `gorm:"type:varchar(255)"`
	Storage string    `gorm:"type:varchar(255)"`
	Hash    string    `gorm:"type:varchar(255)"`
	Data    []byte    `gorm:"type:bytea"`
	gorm.Model
}
