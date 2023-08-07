package routes

import (
	"github.com/gin-gonic/gin"

	"file-service/app/files"
)

func AddRoutes(superRoute *gin.RouterGroup) {
	files.FileRoutes(superRoute)
}