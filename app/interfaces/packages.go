package interfaces

import (
	"file-service/app/scheduler"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type IPackage interface {
	New(server Server) error
	Start() error
	Stop() error
}

type Package struct {
	IPackage
	Name    string
	Depends []string
}

type Server struct {
	DB        *gorm.DB
	Scheduler *scheduler.SchedulerPackage
	Engine    *gin.Engine
	Router    *gin.RouterGroup
	Logger    *log.Logger

	Packages []Package
}
