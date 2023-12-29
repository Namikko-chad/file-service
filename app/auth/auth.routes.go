package auth

import (
	"github.com/gin-gonic/gin"
)

func (ap *AuthPackage) createRoutes(superRoute *gin.RouterGroup) {
	authRoute := superRoute.Group("/auth")
	tokenRoute := authRoute.Group("/token")
	tokenRoute.POST("generate/:tokenType", ap.handlers.Generate)
	tokenRoute.GET("info/:tokenType", CheckAccessTokenMiddleware, ap.handlers.Info)
	tokenRoute.GET("validate/:tokenType", CheckAccessTokenMiddleware, ap.handlers.Validate)
}
