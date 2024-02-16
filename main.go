package main

import (
	"file-service/app"
	"os"
	"os/signal"
	"syscall"

	"golang.org/x/exp/slices"
)

// Swagger
// @title           File-Service
// @version         1.0
// @description     File-Service for store files.
// @termsOfService  http://swagger.io/terms/

// @contact.name   Leonhard Schmidt
// @contact.url    bloodheaven.net
// @contact.email  bloodheaven.net@gmail.com

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html
func main() {
	argsWithoutProg := os.Args[1:]
	if slices.Contains(argsWithoutProg, "--sync") {
		app.Sync()
	} else {
		app.CreateServer()
		exit := make(chan os.Signal, 1)
		signal.Notify(exit, os.Interrupt, syscall.SIGTERM)
		<-exit
		app.StopServer()
	}
}
