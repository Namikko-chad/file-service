package files

import (
	"file-service/app/files/handlers"
	"file-service/app/files/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FilesPackage struct {
	db       *gorm.DB
	handlers *handlers.Handlers
	service  *service.Service
}

func New(db *gorm.DB, router *gin.RouterGroup) (*FilesPackage, error) {
	service, err := service.New(db)
	if err != nil {
		return nil, err
	}
	handlers, err := handlers.New(service)
	if err != nil {
		return nil, err
	}
	fp := &FilesPackage{
		db:       db,
		service:  service,
		handlers: handlers,
	}
	fp.createRoutes(router)

	return fp, nil
}
