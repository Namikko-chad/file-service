package auth

import (
	"file-service/app/interfaces"
)

type AuthPackage struct {
	interfaces.Package
	server   *interfaces.Server
	handlers *Handlers
}

func New(server *interfaces.Server) (*AuthPackage, error) {
	ap := &AuthPackage{
		handlers: &Handlers{},
		Package: interfaces.Package{
			Name:    "auth",
			Depends: []string{},
		},
		server: server,
	}
	ap.createRoutes(server.Router)

	return ap, nil
}

func (ap *AuthPackage) Start() error {
	ap.server.Logger.Print("[Auth] Started")
	return nil
}

func (ap *AuthPackage) Stop() error {
	ap.server.Logger.Print("[Auth] Stopped")
	return nil
}