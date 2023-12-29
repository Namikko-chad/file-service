package main

import (
	"file-service/app"
	db "file-service/app/database"
	modelsFile "file-service/app/files/models"
	modelsStorage "file-service/app/storage"
	"os"
	"os/signal"
	"syscall"

	logger "log"

	"golang.org/x/exp/slices"
)

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
func main() {
	argsWithoutProg := os.Args[1:]
	if slices.Contains(argsWithoutProg, "--sync") {
		sync()
	} else {
		app.CreateServer()
	}

	exit := make(chan os.Signal, 1)
	signal.Notify(exit, os.Interrupt, syscall.SIGTERM)

	<-exit
}

func sync() {
	logger.Print("[Database] Synchronization started")
	db := db.ConnectDB()
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
	err := db.AutoMigrate(&modelsStorage.File{}, &modelsFile.FileUser{})
	if err == nil {
		logger.Print("[Database] Synchronization completed")
	} else {
		logger.Panic("[Database] Synchronization error", err)
		panic("Synchronization error")
	}
}
