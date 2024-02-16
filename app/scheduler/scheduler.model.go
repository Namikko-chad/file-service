package scheduler

import (
	"time"

	"github.com/google/uuid"
)

type SchedulerTask struct {
	Id         uuid.UUID `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name       string    `gorm:"type:varchar(255);not null"`
	StartedAt  time.Time `gorm:"default:now();not null"`
	FinishedAt time.Time
	Status     SchedulerStatus `gorm:"type:logs.\"enum_SchedulerTasks_status\";default:'started';not null"`
	Error      string `gorm:"type:text"`
}

func (s *SchedulerTask) BeforeSync() []string {
	return []string{
		"CREATE SCHEMA IF NOT EXISTS logs",
		`DO $$
		BEGIN
				IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_SchedulerTasks_status') THEN
						CREATE TYPE logs."enum_SchedulerTasks_status" AS enum ('started', 'completed', 'failed');
				END IF;
		END$$;`,
	}
}

func (s *SchedulerTask) TableName() string {
	return "logs.SchedulerTasks"
}

type SchedulerStatus string

const (
	Started   SchedulerStatus = "started"
	Completed SchedulerStatus = "completed"
	Failed    SchedulerStatus = "failed"
)
