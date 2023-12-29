package auth

import (

	"github.com/gin-gonic/gin"
)

type AuthPackage struct {
	handlers *Handlers
}

func New(router *gin.RouterGroup) (*AuthPackage, error) {
	ap := &AuthPackage{
		handlers: &Handlers{},
	}
	ap.createRoutes(router)

	return ap, nil
}