package files

import (
	"github.com/google/uuid"
)

type IFileResponse struct {
	ID     uuid.UUID `json:"id"`
	Name   string    `json:"name"`
	EXT    string    `json:"ext"`
	MIME   string    `json:"mime"`
	Public bool      `json:"public"`
	UserID uuid.UUID `json:"userId"`
	Hash   string    `json:"hash"`
}

type IFileEdit struct {
	Name   string `json:"name"`
	Public bool   `json:"public"`
}
