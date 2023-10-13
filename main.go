package main

import (
	"file-service/app"
	db "file-service/app/database"
	"os"

	"golang.org/x/exp/slices"
)

func main() {
	argsWithoutProg := os.Args[1:]
	if slices.Contains(argsWithoutProg, "--sync") {
		db.SyncDB()
	} else {
		app.CreateServer()
	}
}
