package utils

import (
	"file-service/app/types"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)


func OutputOk(c *gin.Context, res interface{}) {
	httpStatus := http.StatusOK
	if c.Request.Method == http.MethodPost {
		httpStatus = http.StatusCreated
	}
	c.JSON(httpStatus, types.IOutputOk{
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
	fmt.Print("Error ", code, " ", err, "\n")
	httpCode := code
	if code >= 100000 {
		httpCode = code/1000
	}
	c.JSON(int(httpCode), types.IOutputError{
		Ok:   false,
		Code: code,
		Data: err,
		Msg:  msg,
	},
	)
	c.Abort()
}
