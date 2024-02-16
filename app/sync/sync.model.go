package sync

import (
	"file-service/app/database"
	"time"

	"github.com/google/uuid"
)

type Sync struct {
	database.AbstractModel
	FileId     uuid.UUID `gorm:"type:uuid;"`
	Path       string    `gorm:"type:varchar(255);not null"`
	Name       string    `gorm:"type:varchar(255);not null"`
	ModifiedAt time.Time
}
