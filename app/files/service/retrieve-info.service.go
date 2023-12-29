package service

import (
	"file-service/app/files/models"

	"github.com/google/uuid"
)

func (s *Service) RetrieveFileInfo(userId uuid.UUID, fileId uuid.UUID) (*models.FileUser, error) {
	fileUser, err := s.repositories.FileUser.Retrieve(fileId)
	if err != nil {
		return nil, err
	}
	return fileUser, nil
}