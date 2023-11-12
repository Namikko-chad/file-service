package storage

import (
	"crypto/md5"
	"encoding/hex"
	storages "file-service/app/storage/storages"
	dbStorage "file-service/app/storage/storages/database"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Storage struct {
	storages map[string]storages.IStorage
	db       *gorm.DB
}

type FileInfo struct {
	ID      uuid.UUID
	EXT     string
	MIME    string
	Storage string
	Hash    string
	Size    uint64
}

// md5 := md5.Sum(fileRaw.Payload)
// file := models.File{
//   ID:      uuid.New(),
//   EXT:     filepath.Ext(fileRaw.Filename)[1:],
//   MIME:    http.DetectContentType(fileRaw.Payload),
//   Storage: "db",
//   Hash:    hex.EncodeToString(md5[:]),
// }

func New(db *gorm.DB) (*Storage, error) {
	dbStorage, err := dbStorage.New(db)
	if err != nil {
		return nil, err
	}
	storages := make(map[string]storages.IStorage)
	storages[dbStorage.GetName()] = dbStorage
	return &Storage{
		storages: storages,
		db:       db,
	}, nil
}

func (s *Storage) getStorage(size uint64) (storages.IStorage, error) {
	for _, storage := range s.storages {
		if storage.GetConfig().Capacity >= size && storage.GetConfig().Enabled {
			return storage, nil
		}
	}
	return nil, nil
}

func (s *Storage) getStorageType(storage storages.IStorage) string {
	return storage.GetName()
}

func (s *Storage) getHash(data []byte) string {
	var hash = md5.Sum(data)
	return hex.EncodeToString(hash[:])
}

// func (s *Storage) getEXT() string {
// 	return ""
// }

// func (s *Storage) getMime() string {
// 	return ""
// }

func (s *Storage) getSize(data []byte) int {
	return len(data)
}

func (s *Storage) SaveFile(fileInfo FileInfo, data []byte) (FileInfo, error) {
	storage, err := s.getStorage(fileInfo.Size)
	fileInfo.Storage = s.getStorageType(storage)
	fileInfo.ID = uuid.New()
	fileInfo.Hash = s.getHash(data)
	fileInfo.Size = uint64(s.getSize(data))
	if err != nil {
		return fileInfo, err
	}
	storage.SaveFile(fileInfo.ID, data)
	return fileInfo, nil
}

func (s *Storage) LoadFile(fileInfo FileInfo) ([]byte, error) {
	return s.storages[fileInfo.Storage].LoadFile(fileInfo.ID)
}

func (s *Storage) DeleteFile(fileInfo FileInfo) error {
	return s.storages[fileInfo.Storage].DeleteFile(fileInfo.ID)
}
