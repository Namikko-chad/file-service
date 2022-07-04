package models

import (
	"crypto/md5"
	"encoding/hex"
	"file-service/app/config"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
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
	db, err := gorm.Open(postgres.Open(conf.DataBase.Link), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			NoLowerCase: true,
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
	db.AutoMigrate(&FileStorage{})
	db.AutoMigrate(&File{})
}

func MockDB(db *gorm.DB) {
	var filename = "77a5cea0a8fa00ec5959dc2f0525cc67.jpg"
	var fileData, err = os.ReadFile("./test/" + filename)
	if err != nil {
		log.Fatal(err)
	}
	var data = md5.Sum(fileData);
	var fileStorage = FileStorage{
		ID: uuid.New(), 
		EXT: filepath.Ext(filename)[1:], 
		MIME: http.DetectContentType(fileData), 
		Storage: "db", 
		Hash: hex.EncodeToString(data[:]), 
		Data: fileData,
	}
	db.Create(&fileStorage)
	db.Create(&File{
		ID: uuid.New(), 
		FileStorageID: fileStorage.ID, 
		UserID: uuid.New(), 
		Name: filepath.Base(filename)[:len(filename)-len(filepath.Ext(filename))], 
		Public: true,
	})
}
