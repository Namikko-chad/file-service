package utils

import (
	"file-service/app/types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func OutputOk(c *gin.Context, res interface{}) {
	c.JSON(http.StatusOK, types.IOutputOk{
		Ok:     true,
		Result: res,
	})
}

func OutputPagination[Number int64 | int, Res []interface{}](c *gin.Context, count Number, res Res) {
	c.JSON(http.StatusOK, types.IOutputPagination{
		Ok: true,
		Result: types.IOutputPaginationResult{
			Count: int64(count),
			Rows:  res,
		},
	})
}

func OutputEmpty(c *gin.Context) {
	c.JSON(http.StatusOK, types.IOutputEmpty{
		Ok: true,
	})
}

func OutputError(c *gin.Context, code uint32, msg string, err interface{}) {
	c.JSON(int(code/1000), types.IOutputError{
		Ok:   false,
		Code: code,
		Data: err,
		Msg:  msg,
	},
	)
}
