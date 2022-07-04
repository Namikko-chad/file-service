package config

import (
	"os"

	"github.com/gin-gonic/gin"
)

type AuthConfig struct {
	AccessToken  string
	RefreshToken string
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
	Config = &TConfig{
		Auth: AuthConfig{
			AccessToken: getEnv("ACCESS_JWT_TOKEN", ""),
			RefreshToken: getEnv("REFRESH_JWT_TOKEN", ""),
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
