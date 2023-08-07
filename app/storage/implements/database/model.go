package database

import (
	"github.com/google/uuid"
)

type Storage struct {
	FileId uuid.UUID `gorm:"primaryKey;type:uuid;"`
	Data   []byte
}
