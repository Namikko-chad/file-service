package database

import (
	logger "log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)


func ConnectDB() *gorm.DB {
	config := &gorm.Config{
		NamingStrategy: CustomNamingStrategy{
		},
	}
	if DataBaseConfig.Log {
		config.Logger = gormLogger.New(
			logger.New(os.Stdout, "\r\n", logger.LstdFlags), // io writer
			gormLogger.Config{
				SlowThreshold:             time.Second,     // Slow SQL threshold
				LogLevel:                  gormLogger.Info, // Log level
				IgnoreRecordNotFoundError: true,            // Ignore ErrRecordNotFound error for logger
				ParameterizedQueries:      true,            // Don't include params in the SQL log
				Colorful:                  true,            // Disable color
			},
		)
	}
	if db, err := gorm.Open(postgres.Open(DataBaseConfig.Link), config); err != nil {
		logger.Panic("[Database] Failed to connect", err)
		panic("Failed to connect database")
	} else {
		return db
	}
}
