package files

import (
	"github.com/gin-gonic/gin"
)

func FileRoutes(superRoute *gin.RouterGroup) {
	superRoute.GET("files", ListFile)
	superRoute.POST("files", CreateFile)
	superRoute.GET("files/:fileId", RetrieveFile)
	superRoute.PUT("files/:fileId", UpdateFile)
	superRoute.DELETE("files/:fileId", DeleteFile)
	superRoute.GET("files/:fileId/info", RetrieveFileInfo)
}
