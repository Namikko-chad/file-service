package utils

import "file-service/app/types"

func GetError[data map[string]struct{} | string](code uint32, msg string, err data) types.IOutputError[data] {
	return types.IOutputError[data]{
		Ok: false,
		Code: 400000,
		Data: err,
		Msg: msg,
	}
}