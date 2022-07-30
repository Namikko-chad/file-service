package db

import (
	"crypto/md5"
	"encoding/hex"
	"file-service/app/config"
	"file-service/app/db/models"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var (
	DB *gorm.DB
)

// func (schema.NamingStrategy) ColumnName(table string, column string) string {
// 	return strings.ToLower(string(column[0]))+column[1:]
// }

func ConnectDB() *gorm.DB {
	conf := config.New()
	var dialect gorm.Dialector
	if conf.DataBase.Type == "postgresql" {
		dialect = postgres.Open(conf.DataBase.Link)
	} else {
		dialect = sqlite.Open(conf.DataBase.Link)
	}
	db, err := gorm.Open(dialect, &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			NoLowerCase:  true,
			NameReplacer: strings.NewReplacer("ID", "id"),
		},
	})
	if err != nil {
		panic("failed to connect database")
	}
	DB = db
	return db
}

func MigrateDB(db *gorm.DB) {
	db.AutoMigrate(&models.File{})
	db.AutoMigrate(&models.FileUser{})
}

func MockDB(db *gorm.DB) {
	var filename = "77a5cea0a8fa00ec5959dc2f0525cc67.jpg"
	var fileData, err = os.ReadFile("./test/" + filename)
	if err != nil {
		log.Fatal(err)
	}
	var data = md5.Sum(fileData)
	var file = models.File{
		ID:      uuid.New(),
		EXT:     filepath.Ext(filename)[1:],
		MIME:    http.DetectContentType(fileData),
		Storage: "db",
		Hash:    hex.EncodeToString(data[:]),
		Data:    fileData,
	}
	db.Create(&file)
	db.Create(&models.FileUser{
		ID:     uuid.New(),
		FileID: file.ID,
		UserID: uuid.New(),
		Name:   filepath.Base(filename)[:len(filename)-len(filepath.Ext(filename))],
		Public: true,
	})
}
