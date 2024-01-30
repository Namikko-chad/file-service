package scheduler

import (
	"log"
	"time"

	"gorm.io/gorm"
)

func DeleteLogTaskCreate(db *gorm.DB, logger *log.Logger) Task {
	task := Task{
		Name:     "DeleteLogTask",
		Duration: time.Duration(24 * time.Hour),
		Handler: func() {
			logger.Print("DeleteLogTask run\n")
		},
	}
	return task
}
