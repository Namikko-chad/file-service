package service

import (
	models "file-service/app/files/models"
	"github.com/google/uuid"
)

func (s *Service) CreateFile(userId uuid.UUID, filename string, data []byte) (*models.FileUser, error) {

	file, err := s.storage.SaveFile(data)
	if err != nil {
		return nil, err
	}
	clause := models.FileUser{
		FileId: file.Id,
		UserId: userId,
		Name:   filename,
	}
	fileUser, err := s.repositories.FileUser.FindOrCreate(&clause, &clause);
	if  err != nil {
		return nil, err
	}
	fileUser.File = file
	return fileUser, nil
}