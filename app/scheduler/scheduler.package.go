package scheduler

import (
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

var (
	ErrTaskAlreadyExists = errors.New("task already exists")
)

type Task struct {
	Name     string
	Duration time.Duration
	Handler  func()
}

type SchedulerPackage struct {
	db     *gorm.DB
	logger *log.Logger
	tasks  map[string]Task
}

func New(db *gorm.DB, logger *log.Logger) (*SchedulerPackage, error) {
	sp := &SchedulerPackage{
		db:     db,
		logger: logger,
		tasks:  make(map[string]Task),
	}
	deleteLogTask := DeleteLogTaskCreate(db, logger)
	sp.tasks[deleteLogTask.Name] = deleteLogTask
	return sp, nil
}

func (sp *SchedulerPackage) Start() error {
	for _, t := range sp.tasks {
		sp.logger.Printf("Start task: %s, with duration: %s", t.Name, t.Duration)
		go func(t Task) {
			for {
				t.Handler()
				time.Sleep(t.Duration)
			}
		}(t)
	}
	return nil
}

func (sp *SchedulerPackage) Stop() error {
	return nil
}

func (sp *SchedulerPackage) AddTask(t *Task) error {
	if sp.tasks[t.Name].Name != (Task{}.Name) {
		return ErrTaskAlreadyExists
	}
	sp.tasks[t.Name] = *t
	return nil
}
