package app

import (
	db "file-service/app/database"
	modelsFile "file-service/app/files/models"
	modelsScheduler "file-service/app/scheduler"
	modelsStorage "file-service/app/storage"

	logger "log"
)

func Sync() {
	logger.Print("[Database] Synchronization started")
	db := db.ConnectDB()
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
	schedulerModel := modelsScheduler.SchedulerTask{}
	beforeSyncQueries := schedulerModel.BeforeSync();
	for _, query := range beforeSyncQueries {
		db.Exec(query)
	}
	err := db.AutoMigrate(&modelsStorage.File{}, &modelsFile.FileUser{}, &modelsScheduler.SchedulerTask{})
	if err == nil {
		logger.Print("[Database] Synchronization completed")
	} else {
		logger.Panic("[Database] Synchronization error", err)
		panic("Synchronization error")
	}
}