package service

import (
	"errors"

	"github.com/google/uuid"
)

func (s *Service) UpdateFile(userId uuid.UUID, fileId uuid.UUID, name string, public bool) error {
	file, err := s.repositories.FileUser.Retrieve(fileId);
	if err != nil {
		return err
	}
	if file.UserId != userId {
		return errors.New("file is private")
	}
	file.Name = name
	file.Public = public
	if err := s.repositories.FileUser.Update(file); err != nil {
		return err
	}
	return nil
}