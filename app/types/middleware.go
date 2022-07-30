package types

type IOutputOk struct {
	Ok     bool        `json:"ok"`
	Result interface{} `json:"result"`
}

type IOutputPaginationResult struct {
	Count int64         `json:"count"`
	Rows  []interface{} `json:"rows"`
}

type IOutputPagination struct {
	Ok     bool                    `json:"ok"`
	Result IOutputPaginationResult `json:"result"`
}

type IOutputEmpty struct {
	Ok bool `json:"ok"`
}

type IOutputError struct {
	Ok   bool        `json:"ok"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
	Code uint32      `json:"code"`
}

type IListParam struct {
	Limit  int32  `form:"limit"`
	Offset int32  `form:"offset"`
	Search string `form:"search"`
}
