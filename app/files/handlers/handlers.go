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

var userId, _ = uuid.Parse("145c094f-edcd-47a6-83aa-3ade32d4636e")

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
