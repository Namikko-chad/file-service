package app

import (
	_ "github.com/joho/godotenv/autoload"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"file-service/app/auth"
	"file-service/app/config"
	"file-service/app/database"
	"file-service/app/files"
	"file-service/app/utils"
)

type Server struct {
	DB     *gorm.DB
	Router *gin.Engine
}

func CreateServer() {
	db := database.ConnectDB()
	gin.SetMode(config.Mode)
	server := gin.New()
	server.Use(gin.Logger())
	server.Use(globalRecover)
	router := server.Group("/api")
	auth.New(router)
	files.New(db, router)
	AddSwagger(router)
	server.SetTrustedProxies([]string{"127.0.0.1"})
	server.Run(config.Server.Host + ":" + config.Server.Port)
}

func globalRecover(c *gin.Context) {
	defer func(c *gin.Context) {
		if rec := recover(); rec != nil {
			utils.OutputError(c, 500, "Internal server error", make(map[string]string, 0))
		}
	}(c)
	c.Next()
}
