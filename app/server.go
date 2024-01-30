package app

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"github.com/gin-gonic/gin"

	"file-service/app/auth"
	"file-service/app/config"
	"file-service/app/database"
	"file-service/app/files"
	"file-service/app/interfaces"
	"file-service/app/scheduler"
	"file-service/app/utils"
)

var server interfaces.Server

func CreateServer() interfaces.Server {
	gin.SetMode(config.Mode)
	server = interfaces.Server{
		Engine: gin.New(),
		Logger: log.New(os.Stdout, "[FileService] ", log.LstdFlags),
	}
	server.DB = database.ConnectDB()
	server.Engine.Use(gin.Logger())
	server.Engine.Use(globalRecover)
	server.Router = server.Engine.Group("/api")
	schedulerPackage, err := scheduler.New(server.DB, server.Logger)
	if err != nil {
		panic(err)
	}
	server.Scheduler = schedulerPackage
	authPackage, err := auth.New(&server)
	if err != nil {
		panic(err)
	}
	filesPackage, err := files.New(&server)
	if err != nil {
		panic(err)
	}
	packages := []interfaces.IPackage{
		authPackage,
		filesPackage,
	}
	for _, p := range packages {
		err := p.Start()
		if err != nil {
			panic(err)
		}
	}
	err = schedulerPackage.Start()
	if err != nil {
		panic(err)
	}
	AddSwagger(server.Router)
	server.Engine.SetTrustedProxies([]string{"127.0.0.1"})
	server.Engine.Run(config.Server.Host + ":" + config.Server.Port)
	return server
}

func StopServer() {
	server.Logger.Print("[FileService] Stopping server")
	for _, p := range server.Packages {
		err := p.Stop()
		if err != nil {
			panic(err)
		}
	}
}

func globalRecover(c *gin.Context) {
	defer func(c *gin.Context) {
		if rec := recover(); rec != nil {
			utils.OutputError(c, 500, "Internal server error", make(map[string]string, 0))
		}
	}(c)
	c.Next()
}
