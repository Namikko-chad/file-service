package sync

import (
	"file-service/app/utils"
	"strconv"
	"strings"
	"time"
)

type SyncConfig struct {
	Folders     []string
	Periodicity time.Duration
	Exclude     []string
	MaxSize     int64
	LastSync    time.Time
}

func Load() *SyncConfig {
	duration, err := time.ParseDuration(utils.GetEnv("SYNC_PERIODICITY", "60"))
	if err != nil {
		duration = 60
	}
	maxSize, err := strconv.ParseInt(utils.GetEnv("SYNC_MAXSIZE", ""), 10, 64)
	if err != nil {
		maxSize = 0
	}
	return &SyncConfig{
		Folders:     strings.Split(utils.GetEnv("SYNC_FOLDER", ""), ","),
		Periodicity: duration,
		Exclude:     strings.Split(utils.GetEnv("SYNC_EXCLUDE", ""), ","),
		MaxSize:     maxSize,
		LastSync:    time.Unix(0, 0),
	}
}
