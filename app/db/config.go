package db

import (
	"file-service/app/utils"

	"log"
)

type TDataBaseConfig struct {
	Link string
	Type string
}

var (
	DataBaseConfig *TDataBaseConfig
)

func init() {
	log.Print("Load db config")

	DataBaseConfig = &TDataBaseConfig{
		Link: utils.GetEnv("DATABASE_LINK", ""),
		Type: utils.GetEnv("DATABASE_TYPE", "postgres"),
	}
}
