package handlers

import (
	models "file-service/app/files/models"
	"file-service/app/files/service"

	"github.com/google/uuid"
)

type Handlers struct {
	service *service.Service
}

var userId, _ = uuid.Parse("145c094f-edcd-47a6-83aa-3ade32d4636e")

func New(service *service.Service) (*Handlers, error) {
	return &Handlers{
		service: service,
	}, nil
}

func fileResponse(fileUser *models.FileUser) FileResponse {
	return FileResponse{
		ID:     fileUser.Id,
		UserID: fileUser.UserId,
		Name:   fileUser.Name,
		EXT:    fileUser.File.EXT,
		MIME:   fileUser.File.MIME,
		Public: fileUser.Public,
		Hash:   fileUser.File.Hash,
	}
}
