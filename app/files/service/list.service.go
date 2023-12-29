package service

import (
	models "file-service/app/files/models"
	"file-service/app/types"

	"github.com/google/uuid"
)

func (s *Service) ListFile(userId uuid.UUID, param types.IListParam) ([]models.FileUser, int64, error) {
	param.Where = append(param.Where, "\"FileUsers\".\"userId\" = '"+ userId.String() +"'")
	files, count, err := s.repositories.FileUser.List(param);
	return files, count, err
}