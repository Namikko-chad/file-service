package app

import (
	"file-service/app/config"
	"file-service/app/models"
	"file-service/app/routes"
	"file-service/docs"

	"github.com/gin-gonic/gin"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"

	swaggerfiles "github.com/swaggo/files"
)

type Server struct {
	DB     *gorm.DB
	Router *gin.Engine
}

var (
	server Server
)

// @title           File-Service
// @version         1.0
// @description     File-Service for store files.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  bloodheaven.net@gmail.com

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @securityDefinitions.apikey	JWT
func CreateServer() {
	config.New()
	server.DB = models.ConnectDB()
	models.MigrateDB(server.DB)
	go models.MockDB(server.DB)
	gin.SetMode(config.Config.Mode)
	server.Router = gin.Default()
	router := server.Router.Group("/api")
	routes.AddRoutes(router)
	// Swagger
	// @BasePath /api
	docs.SwaggerInfo.BasePath = "/api"
	docs.SwaggerInfo.Host = config.Config.Server.Host + ":" + config.Config.Server.Port
	docs.SwaggerInfo.Schemes = append(docs.SwaggerInfo.Schemes, "http")
	router.GET("documentation/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	server.Router.Run(config.Config.Server.Host + ":" + config.Config.Server.Port)
	// JWT
	

}
