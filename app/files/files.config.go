package files

import (
	"file-service/app/utils"
)

type TFilesConfig struct {
	Link string
	Type string
}

var (
	FilesConfig *TFilesConfig
)

func init() {
	FilesConfig = &TFilesConfig{
		Link: utils.GetEnv("DATABASE_URL", ""),
		Type: utils.GetEnv("DATABASE_TYPE", "sqlite"),
	}
}
