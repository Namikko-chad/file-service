package files

import (
	"file-service/app/files/repositories"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FilesPackage struct {
	db           *gorm.DB
	repositories *repositories.Repositories
}

func New(db *gorm.DB, router *gin.RouterGroup) (*FilesPackage, error) {
	repositories, err := repositories.New(db)
	if err != nil {
		return nil, err
	}
	fp := &FilesPackage{
		db: db,
		repositories: repositories,
	}
	fp.createRoutes(router)

	return fp, nil
}
