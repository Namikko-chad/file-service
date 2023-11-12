package repositories

import (
	"crypto/md5"
	"encoding/hex"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"file-service/app/database"
	models "file-service/app/files/models"
)

type Repositories struct {
	File     FileRepository
	FileUser FileUserRepository
}

var userId, _ = uuid.Parse("a00c03e4-2c90-4a85-8531-55bfcbb22127")
var fileId, _ = uuid.Parse("f00c03e4-2c90-4a85-8531-55bfcbb22127")
var hash = md5.Sum([]byte("test"))
var fileUser = models.FileUser{
	AbstractModel: database.AbstractModel{
		Id:        uuid.New(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	},
	UserId: userId,
	FileId: fileId,
	Name:   "test.txt",
	Public: true,
	File: &models.File{
		AbstractModel: database.AbstractModel{
			Id:        fileId,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		EXT:     "txt",
		MIME:    "text/plain",
		Size:    1,
		Storage: "db",
		Hash:    hex.EncodeToString(hash[:]),
	},
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
