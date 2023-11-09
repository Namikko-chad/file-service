package config

import (
	"file-service/app/utils"
	"strings"

	"log"

	"github.com/gin-gonic/gin"
)

// type JWTParams struct {
// 	Secret string
// }

// type AuthConfig struct {
// 	File  JWTParams
// 	User  JWTParams
// 	Admin JWTParams
// }

type ServerConfig struct {
	Host        string
	Port        string
	Methods     []string
	SwaggerPath string
}

var (
	Server ServerConfig
	Mode   string
)

func init() {
	log.Print("Load global config")
	// Auth: AuthConfig{
	// 	File: JWTParams{
	// 		Secret: utils.GetEnv("FA_SECRET", ""),
	// 	},
	// 	User: JWTParams{
	// 		Secret: utils.GetEnv("UA_SECRET", ""),
	// 	},
	// 	Admin: JWTParams{
	// 		Secret: utils.GetEnv("AA_SECRET", ""),
	// 	},
	// },
	Server = ServerConfig{
		Host:        utils.GetEnv("SERVER_HOST", "127.0.0.1"),
		Port:        utils.GetEnv("SERVER_PORT", "3050"),
		Methods:     strings.Split(utils.GetEnv("SERVER_METHODS", "GET,POST,PUT,DELETE,OPTIONS"), ","),
		SwaggerPath: utils.GetEnv("SWAGGER_PATH", "./api/swagger/"),
	}
	Mode = utils.GetEnv("MODE", gin.ReleaseMode)
}
