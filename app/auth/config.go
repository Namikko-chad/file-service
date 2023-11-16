package auth

import (
	"file-service/app/utils"

	"log"
)

type JWTParams struct {
	Secret string
}

type AuthConfig struct {
	File  JWTParams
	User  JWTParams
	Admin JWTParams
}

var (
	Auth AuthConfig
)

func init() {
	log.Print("Load auth config")
	Auth = AuthConfig{
		File: JWTParams{
			Secret: utils.GetEnv("FA_SECRET", ""),
		},
		User: JWTParams{
			Secret: utils.GetEnv("UA_SECRET", ""),
		},
		Admin: JWTParams{
			Secret: utils.GetEnv("AA_SECRET", ""),
		},
	}
}
