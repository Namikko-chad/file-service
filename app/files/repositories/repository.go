package repositories

import (
	"crypto/md5"
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

var userId, _ = uuid.Parse("145c094f-edcd-47a6-83aa-3ade32d4636e")
var fileId, _ = uuid.Parse("c2da9966-078a-442a-8c1c-4d62d05e31f1")
var fileUserId, _ = uuid.Parse("0c170e84-2c5f-49fa-979e-4edf4d18a037")
var timed, _ = time.Parse("2006-01-02 15:04:05.999999999 -07:00", "2023-11-09 07:13:17.313173 +00:00")
var hash = md5.Sum([]byte("test"))
var fileUser = models.FileUser{
	AbstractModel: database.AbstractModel{
		Id:        fileUserId,
		CreatedAt: timed,
		UpdatedAt: timed,
	},
	UserId: userId,
	FileId: fileId,
	Name:   "Screenshot from 2023-11-02 12-00-22.png",
	Public: false,
	File: &models.File{
		AbstractModel: database.AbstractModel{
			Id:        fileId,
			CreatedAt: timed,
			UpdatedAt: timed,
		},
		EXT:     "png",
		MIME:    "image/png",
		Size:    54044,
		Storage: "db",
		Hash:    "d8589a624f98b30a311a6316be089dff",
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
