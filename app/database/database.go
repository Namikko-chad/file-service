package database

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectDB() *gorm.DB {
	log := log.New(os.Stdout, "[Database] ", log.LstdFlags)
	configLogger := logger.Config{
		SlowThreshold:             time.Second, // Slow SQL threshold
		LogLevel:                  logger.Warn, // Log level
		IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
		ParameterizedQueries:      true,        // Don't include params in the SQL log
		Colorful:                  true,        // Disable color
	}
	if DataBaseConfig.Log {
		configLogger.LogLevel = logger.Info
	}
	configGorm := &gorm.Config{
		NamingStrategy: CustomNamingStrategy{},
		Logger:         logger.New(log, configLogger),
	}
	if db, err := gorm.Open(postgres.Open(DataBaseConfig.Link), configGorm); err != nil {
		log.Panic("Failed to connect", err)
		panic("Failed to connect database")
	} else {
		log.Print("Connected to database successfully")
		return db
	}
}
