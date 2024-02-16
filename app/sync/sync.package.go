package sync

import (
	"file-service/app/interfaces"

	"gorm.io/gorm"
)

type SyncPackage struct {
	interfaces.Package
	config *SyncConfig
	server *interfaces.Server
	db     *gorm.DB
}

func New(server *interfaces.Server) (*SyncPackage, error) {
	sp := &SyncPackage{
		db:     server.DB,
		config: Load(),
		Package: interfaces.Package{
			Name:    "sync",
			Depends: []string{"storage"},
		},
		server: server,
	}

	return sp, nil
}

func (sp *SyncPackage) Start() error {
	sp.server.Logger.Print("[Sync] Started")
	err := sp.Sync()
	if err != nil {
		sp.server.Logger.Fatal(err)
	}
	return nil
}

func (sp *SyncPackage) Stop() error {
	sp.server.Logger.Print("[Sync] Stopped")
	return nil
}
