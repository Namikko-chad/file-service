package app

import (
	_ "github.com/joho/godotenv/autoload"

	"file-service/app/config"
	"file-service/app/database"
	"file-service/app/files"

	// "file-service/app/routes"
	// "file-service/docs"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Server struct {
	DB     *gorm.DB
	Router *gin.Engine
}

func CreateServer() {
	db := database.ConnectDB()
	gin.SetMode(config.Mode)
	server := gin.Default()
	router := server.Group("/api")
	files.New(db, router)
	AddSwagger(router)
	server.SetTrustedProxies([]string{"127.0.0.1"})
	server.Run(config.Server.Host + ":" + config.Server.Port)
}
