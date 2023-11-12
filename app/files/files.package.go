package files

import (
	"file-service/app/files/handlers"
	"file-service/app/files/repositories"
	"file-service/app/storage"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FilesPackage struct {
	db           *gorm.DB
	repositories *repositories.Repositories
	handlers     *handlers.Handlers
	storage      *storage.Storage
}

func New(db *gorm.DB, router *gin.RouterGroup) (*FilesPackage, error) {
	repositories, err := repositories.New(db)
	if err != nil {
		return nil, err
	}
	storage, err := storage.New(db)
	if err != nil {
		return nil, err
	}
	handlers, err := handlers.New(repositories, storage)
	if err != nil {
		return nil, err
	}
	fp := &FilesPackage{
		db:           db,
		repositories: repositories,
		handlers:     handlers,
		storage:      storage,
	}
	fp.createRoutes(router)

	return fp, nil
}
