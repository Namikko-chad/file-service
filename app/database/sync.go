package database

import (
	logger "log"

	_ "github.com/joho/godotenv/autoload"

	files "file-service/app/files/models"
)

func SyncDB() {
	logger.Print("[Database] Synchronization started")
	db := ConnectDB()
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
	err := db.AutoMigrate(&files.File{}, &files.FileUser{})
	if err == nil {
		logger.Print("[Database] Synchronization completed")
	} else {
		logger.Panic("[Database] Synchronization error", err)
		panic("Synchronization error")
	}
}
