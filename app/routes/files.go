package routes

import (
	"file-service/app/api"

	"github.com/gin-gonic/gin"
)

func FileRoutes(superRoute *gin.RouterGroup) {
	superRoute.GET("files", api.ListFile)
	superRoute.POST("files", api.CreateFile)
	superRoute.GET("files/:fileId", api.RetrieveFile)
	superRoute.PUT("files/:fileId", api.UpdateFile)
	superRoute.DELETE("files/:fileId", api.DeleteFile)
	superRoute.GET("files/:fileId/info", api.RetrieveFileInfo)
}
