package scheduler

import (
	"context"
	"time"
)

type ITask interface {
	Task(c context.Context)
}

type Task struct {
	ITask
	Duration *time.Duration
}