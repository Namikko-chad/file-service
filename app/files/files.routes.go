package files

import (
	"github.com/gin-gonic/gin"
)

func (h *FilesPackage) createRoutes(superRoute *gin.RouterGroup) {
	superRoute.GET("files", h.ListFile)
	superRoute.POST("files", h.CreateFile)
	superRoute.GET("files/:fileId", h.RetrieveFile)
	superRoute.GET("files/:fileId/info", h.RetrieveFileInfo)
	superRoute.PUT("files/:fileId", h.UpdateFile)
	superRoute.DELETE("files/:fileId", h.DeleteFile)
}
