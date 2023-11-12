package app

import (
	"file-service/app/config"

	"file-service/swagger"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func AddSwagger(router *gin.RouterGroup) {
	swagger.SwaggerInfo.BasePath = "/api"
	swagger.SwaggerInfo.Host = config.Server.Host + ":" + config.Server.Port
	swagger.SwaggerInfo.Schemes = []string{"http", "https"}
	router.GET("swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
}
