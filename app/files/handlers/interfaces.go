package handlers

import (
	"github.com/google/uuid"
)

type FileParam struct {
	ID string `uri:"fileId" binding:"required,uuid"`
}

type FileResponse struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	EXT    string    `json:"ext"`
	MIME   string    `json:"mime"`
	Public bool      `json:"public"`
	UserID uuid.UUID `json:"userId"`
	Hash   string    `json:"hash"`
}

type FileEdit struct {
	Name   string `json:"name"`
	Public bool   `json:"public"`
}
