package config

import (
	"file-service/app/utils"

	"log"

	"github.com/gin-gonic/gin"
)

type JWTParams struct {
	Secret string
}

type AuthConfig struct {
	File  JWTParams
	User  JWTParams
	Admin JWTParams
}

type ServerConfig struct {
	Host string
	Port string
}

type TConfig struct {
	Auth   AuthConfig
	Server ServerConfig
	Mode   string
}

var (
	Config *TConfig
)

func init() {
	log.Print("Load global config");
	Config = &TConfig{
		Auth: AuthConfig{
			File: JWTParams{
				Secret: utils.GetEnv("FA_SECRET", ""),
			},
			User: JWTParams{
				Secret: utils.GetEnv("UA_SECRET", ""),
			},
			Admin: JWTParams{
				Secret: utils.GetEnv("AA_SECRET", ""),
			},
		},
		Server: ServerConfig{
			Host: utils.GetEnv("SERVER_HOST", "127.0.0.1"),
			Port: utils.GetEnv("SERVER_PORT", "3050"),
		},
		Mode: utils.GetEnv("MODE", gin.ReleaseMode),
	}
}
