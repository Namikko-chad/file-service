package files

import (
	"file-service/app/files/handlers"
	"file-service/app/files/service"
	"file-service/app/interfaces"

	"gorm.io/gorm"
)

type FilesPackage struct {
	interfaces.Package
	server   *interfaces.Server
	db       *gorm.DB
	handlers *handlers.Handlers
	service  *service.Service
}

func New(server *interfaces.Server) (*FilesPackage, error) {
	service, err := service.New(server.DB)
	if err != nil {
		return nil, err
	}
	handlers, err := handlers.New(service)
	if err != nil {
		return nil, err
	}
	fp := &FilesPackage{
		db:       server.DB,
		service:  service,
		handlers: handlers,
		Package: interfaces.Package{
			Name:    "files",
			Depends: []string{"auth", "storage"},
		},
		server: server,
	}
	fp.createRoutes(server.Router)

	return fp, nil
}

func (fp *FilesPackage) Start() error {
	fp.server.Logger.Print("[Files] Started")
	return nil
}

func (fp *FilesPackage) Stop() error {
	fp.server.Logger.Print("[Files] Stopped")
	return nil
}
