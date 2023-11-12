package handlers

import (
	models "file-service/app/files/models"
	"file-service/app/files/repositories"
	"file-service/app/storage"

	"github.com/google/uuid"
)

type Handlers struct {
	repositories *repositories.Repositories
	storage      *storage.Storage
}

var userId, _ = uuid.Parse("a00c03e4-2c90-4a85-8531-55bfcbb22127")

func New(repositories *repositories.Repositories, storage *storage.Storage) (*Handlers, error) {
	return &Handlers{
		repositories: repositories,
		storage:      storage,
	}, nil
}

func fileResponse(fileUser *models.FileUser) IFileResponse {
	return IFileResponse{
		ID:     fileUser.Id,
		UserID: fileUser.UserId,
		Name:   fileUser.Name,
		EXT:    fileUser.File.EXT,
		MIME:   fileUser.File.MIME,
		Public: fileUser.Public,
		Hash:   fileUser.File.Hash,
	}
}
