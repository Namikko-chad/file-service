package scheduler

import (
	"time"

	"github.com/google/uuid"
)

type SchedulerTask struct {
	Id         uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name       string    `gorm:"type:varchar(255);not null"`
	StartedAt  time.Time `gorm:"not null"`
	FinishedAt time.Time
	Status     SchedulerStatus `gorm:"type:logs.\"enum_SchedulerTasks_status\";default:'started'"`
	Error      string `gorm:"type:text"`
}

func (s *SchedulerTask) BeforeSync() []string {
	return []string{
		"CREATE SCHEMA IF NOT EXISTS logs",
		"CREATE TYPE logs.\"enum_SchedulerTasks_status\" AS enum ('started', 'completed', 'failed');",
	}
}

func (s *SchedulerTask) TableName() string {
	return "logs.SchedulerTask"
}

type SchedulerStatus string

const (
	Started   SchedulerStatus = "started"
	Completed SchedulerStatus = "completed"
	Failed    SchedulerStatus = "failed"
)
