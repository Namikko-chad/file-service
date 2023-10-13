package database

import (
	logger "log"
	"os"
	"time"

	"strings"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

var (
	DB *gorm.DB
)

type CustomNameStrategy schema.NamingStrategy

// ColumnName convert string to column name
func (cns *CustomNameStrategy) ColumnName(table, column string) string {
	return strings.ToLower(string(column[0])) + column[1:]
}

func (cns *CustomNameStrategy) TableName(table string) string {
	return strings.ToUpper(string(table[0])) + table[1:]
}

func ConnectDB() *gorm.DB {
	config := &gorm.Config{
		NamingStrategy: CustomNameStrategy{
			
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
		DB = db
	}
	return DB
}
