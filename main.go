package main

import (
	"file-service/app"
	db "file-service/app/database"
	models "file-service/app/files/models"
	"os"

	logger "log"

	"golang.org/x/exp/slices"
)

func main() {
	argsWithoutProg := os.Args[1:]
	if slices.Contains(argsWithoutProg, "--sync") {
		sync()
	} else {
		app.CreateServer()
	}
}

func sync() {
	logger.Print("[Database] Synchronization started")
	db := db.ConnectDB()
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
	err := db.AutoMigrate(&models.File{}, &models.FileUser{})
	if err == nil {
		logger.Print("[Database] Synchronization completed")
	} else {
		logger.Panic("[Database] Synchronization error", err)
		panic("Synchronization error")
	}
}
