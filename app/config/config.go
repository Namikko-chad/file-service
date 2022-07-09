package config

import (
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AuthConfig struct {
	AccessToken         string
	AccessTokenLifetime uint64
}

type DataBaseConfig struct {
	Link string
}

type ServerConfig struct {
	Host string
	Port string
}

type TConfig struct {
	Auth     AuthConfig
	DataBase DataBaseConfig
	Server   ServerConfig
	Mode     string
}

var (
	Config *TConfig
)

func New() *TConfig {
	accessTokenLifetime, err := strconv.ParseInt(getEnv("ACCESS_JWT_TOKEN_LIFETIME", "900"), 10, 32)
	if err != nil {
		panic("Can't parse ACCESS_JWT_TOKEN_LIFETIME")
	}
	Config = &TConfig{
		Auth: AuthConfig{
			AccessToken:         getEnv("ACCESS_JWT_TOKEN", ""),
			AccessTokenLifetime: uint64(accessTokenLifetime),
		},
		DataBase: DataBaseConfig{
			Link: getEnv("DATABASE_LINK", ""),
		},
		Server: ServerConfig{
			Host: getEnv("SERVER_HOST", "127.0.0.1"),
			Port: getEnv("SERVER_PORT", "3000"),
		},
		Mode: getEnv("GIN_MODE", gin.ReleaseMode),
	}
	return Config
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}
