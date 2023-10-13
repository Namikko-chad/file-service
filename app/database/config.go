package database

import (
	"file-service/app/utils"

	"log"
)

type TDataBaseConfig struct {
	Link string
	Type string
	Log  bool
}

var (
	DataBaseConfig *TDataBaseConfig
)

func init() {
	log.Print("[Database] Load config")

	DataBaseConfig = &TDataBaseConfig{
		Link: utils.GetEnv("DATABASE_LINK", ""),
		Type: utils.GetEnv("DATABASE_TYPE", "postgres"),
		Log:  utils.GetEnv("DEBUG", "false") == "true",
	}
}
