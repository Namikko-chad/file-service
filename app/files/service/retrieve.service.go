package service

import (
	"github.com/google/uuid"
)

func (s *Service) RetrieveFile(userId uuid.UUID, fileId uuid.UUID) ([]byte, error) {
	fileUser, err := s.repositories.FileUser.Retrieve(fileId)
	if err != nil {
		return nil, err
	}
	data, err := s.storage.LoadFile(fileUser.FileId)
	if err != nil {
		return nil, err
	}
	return data, nil
}