package app

import (
	_ "github.com/joho/godotenv/autoload"

	"file-service/app/config"
	"file-service/app/database"
	"file-service/app/files"

	// "file-service/app/routes"
	// "file-service/docs"

	"github.com/gin-gonic/gin"
	// ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
	// swaggerfiles "github.com/swaggo/files"
)

type Server struct {
	DB     *gorm.DB
	Router *gin.Engine
}

// var (
// 	server Server
// )

func CreateServer() {
	db := database.ConnectDB()
	gin.SetMode(config.Mode)
	gin := gin.Default()
	router := gin.Group("/api")
	files.New(db, router);
	gin.Run(config.Server.Host + ":" + config.Server.Port)
	// Swagger
	// @title           File-Service
	// @version         1.0
	// @description     File-Service for store files.
	// @termsOfService  http://swagger.io/terms/

	// @contact.name   Leonhard Schmidt
	// @contact.url    bloodheaven.net
	// @contact.email  bloodheaven.net@gmail.com

	// @license.name  Apache 2.0
	// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

	// @securityDefinitions.apikey  JWT
	// docs.SwaggerInfo.BasePath = "/api"
	// docs.SwaggerInfo.Host = config.Config.Server.Host + ":" + config.Config.Server.Port
	// docs.SwaggerInfo.Version = "1.0"
	// docs.SwaggerInfo.Schemes = []string{"http", "https"}
	// router.GET("documentation/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	// server.Router.Run(config.Config.Server.Host + ":" + config.Config.Server.Port)
	// JWT

}
