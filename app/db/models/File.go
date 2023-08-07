package models

import (
	"time"

	"github.com/google/uuid"
)

type File struct {
	ID        uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	EXT       string    `gorm:"type:varchar(10);column:ext;not null"`
	MIME      string    `gorm:"type:varchar(255);column:mime;not null"`
	Size      string    `gorm:"type:bigint;not null"`
	Storage   string    `gorm:"type:varchar(255);not null"`
	Hash      string    `gorm:"type:varchar(255);not null"`
	// fileUsers *FileUser
}
