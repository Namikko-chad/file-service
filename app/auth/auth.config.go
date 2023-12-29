package auth

import (
	"file-service/app/utils"

	"log"
)

type JWTConfig struct {
	Secret string
}

type Config map[TokenType]JWTConfig

var (
	AuthConfig Config
)

func init() {
	log.Print("Load auth config")
	AuthConfig = make(Config)
	AuthConfig[TokenTypeAdminAccess] = JWTConfig{
		Secret: utils.GetEnv("AA_SECRET", ""),
	}
	AuthConfig[TokenTypeUserAccess] = JWTConfig{
		Secret: utils.GetEnv("UA_SECRET", ""),
	}
	AuthConfig[TokenTypeFileAccess] = JWTConfig{
		Secret: utils.GetEnv("FA_SECRET", ""),
	}
}
