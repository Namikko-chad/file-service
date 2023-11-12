package files

import (
	"github.com/gin-gonic/gin"
)

func (h *FilesPackage) createRoutes(superRoute *gin.RouterGroup) {
	superRoute.GET("files", h.handlers.ListFile)
	superRoute.POST("files", h.handlers.CreateFile)
	superRoute.GET("files/:fileId", h.handlers.RetrieveFile)
	superRoute.GET("files/:fileId/info", h.handlers.RetrieveFileInfo)
	superRoute.PUT("files/:fileId", h.handlers.UpdateFile)
	superRoute.DELETE("files/:fileId", h.handlers.DeleteFile)
}
