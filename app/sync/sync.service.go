package sync

import (
	"fmt"
	"io/fs"
	"time"

	// "log"
	"os"
)

type Stack []string

type File struct {
	path       string
	name       string
	modifiedAt time.Time
}

func (s *Stack) Push(val string) {
	*s = append(*s, val)
}

func (s *Stack) Pop() string {
	if len(*s) == 0 {
		return ""
	}
	val := (*s)[len(*s)-1]
	*s = (*s)[:len(*s)-1]
	return val
}

func (sp *SyncPackage) Sync() error {
	stack := Stack{}
	stack = sp.config.Folders
	lastSync, err := sp.LastSyncTime()
	if err != nil {
		sp.config.LastSync = time.Unix(0, 0)
	} else {
		sp.config.LastSync = lastSync
	}
	
	var fileArray []File
	var dir string
	dir = stack.Pop()
	for dir != "" {
		files, _ := os.ReadDir(dir)
		for _, file := range files {
			fileInfo, _ := file.Info()
			if !sp.filter(fileInfo) {
				continue
			}
			if file.IsDir() {
				stack.Push(fmt.Sprintf("%s/%s", dir, file.Name()))
				continue
			}
			fileArray = append(fileArray, File{
				path:       dir,
				name:       file.Name(),
				modifiedAt: fileInfo.ModTime(),
			})
		}
		dir = stack.Pop()
	}
	for _, file := range fileArray {
		fmt.Printf("%s/%s\r\n", file.path, file.name)
	}
	return nil
}

func (sp *SyncPackage) LastSyncTime() (time.Time, error) {
	var lastSync Sync
	err := sp.db.Last(&lastSync).Order("modifiedAt DESC").Error
	if err != nil {
		return lastSync.ModifiedAt, err
	}
	return lastSync.ModifiedAt, nil
}

func (sp *SyncPackage) filter(file fs.FileInfo) bool {
	if file.ModTime().Before(sp.config.LastSync) {
		fmt.Printf("skip by modified time, %s\r\n", file.Name())
		return false
	}
	if sp.config.MaxSize != 0 && file.Size() > sp.config.MaxSize {
		fmt.Printf("skip by size, %s, size: %d\r\n", file.Name(), file.Size())
		return false
	}
	// TODO added exclusion
	// if strings.Join(sp.config.Exclude, file.Name())
	return true
}

// func (sp *SyncPackage) LoadFilesFromDB() ([]Sync, error) {
// 	var files []Sync
// 	err := sp.db.Select(&files).Distinct("path").Error
// 	if err != nil {
// 		return files, err
// 	}
// 	return files, nil
// }
