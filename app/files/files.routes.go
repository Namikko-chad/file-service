package files

import (
	"github.com/gin-gonic/gin"

	"file-service/app/auth"
)

func (h *FilesPackage) createRoutes(superRoute *gin.RouterGroup) {
	filesRoute := superRoute.Group("/files")
	filesRoute.Use(auth.CheckAccessTokenMiddleware)
	filesRoute.GET("/", h.handlers.ListFile)
	filesRoute.POST("/", h.handlers.CreateFile)
	filesRoute.GET(":fileId", h.handlers.RetrieveFile)
	filesRoute.GET(":fileId/info", h.handlers.RetrieveFileInfo)
	filesRoute.PUT(":fileId", h.handlers.UpdateFile)
	filesRoute.DELETE(":fileId", h.handlers.DeleteFile)
}
