package db

import (
	"file-service/app/db/models"
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
func (_ *CustomNameStrategy) ColumnName(table, column string) string {
	return strings.ToLower(string(column[0])) + column[1:]
}

func ConnectDB() *gorm.DB {
	newLogger := gormLogger.New(
		logger.New(os.Stdout, "\r\n", logger.LstdFlags), // io writer
		gormLogger.Config{
			SlowThreshold:             time.Second,     // Slow SQL threshold
			LogLevel:                  gormLogger.Info, // Log level
			IgnoreRecordNotFoundError: true,            // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,            // Don't include params in the SQL log
			Colorful:                  true,            // Disable color
		},
	)
	if db, err := gorm.Open(postgres.Open(DataBaseConfig.Link), &gorm.Config{
		Logger: newLogger,
		NamingStrategy: CustomNameStrategy{
			NoLowerCase:  true,
			NameReplacer: strings.NewReplacer("ID", "id" /*, "CreatedAt", "createdAt"*/),
		},
	}); err != nil {
		logger.Panic("Failed to connect database", err)
		panic("Failed to connect database")
	} else {
		DB = db
	}
	return DB
}

func MigrateDB(db *gorm.DB) {
	db.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
	err := db.AutoMigrate(&models.File{}, &models.FileUser{})
	if err == nil {
		logger.Print("Migration completed")
	} else {
		logger.Panic("Migration error", err)
		panic("Migration error")
	}
}
