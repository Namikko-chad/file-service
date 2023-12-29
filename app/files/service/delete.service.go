package service

import (
	"errors"

	"github.com/google/uuid"
)

func (s *Service) DeleteFile(userId uuid.UUID, fileId uuid.UUID) error {
	file, err := s.repositories.FileUser.Retrieve(fileId);
	if err != nil {
		return err
	}
	if file.UserId != userId {
		return errors.New("file is private")
	}
	if err := s.repositories.FileUser.Delete(fileId); err != nil {
		return err
	}
	return nil
}