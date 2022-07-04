package routes

import "github.com/gin-gonic/gin"

func AddRoutes(superRoute *gin.RouterGroup) {
	AuthRoutes(superRoute)
	FileRoutes(superRoute)
}