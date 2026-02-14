package models

import (
	"time"
)

type Bounty struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	StudentID   uint      `json:"student_id" gorm:"not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text;not null"`
	SubjectTag  string    `json:"subject_tag"`
	Budget      float64   `json:"budget" gorm:"type:decimal(10,2);not null"`
	Status      string    `json:"status" gorm:"type:enum('OPEN','IN_PROGRESS','CLOSED');default:'OPEN'"`
	RoomID      string    `json:"room_id,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	
	// Relations
	Student User  `json:"student,omitempty" gorm:"foreignKey:StudentID"`
	Bids    []Bid `json:"bids,omitempty" gorm:"foreignKey:BountyID"`
}

func (Bounty) TableName() string {
	return "bounties"
}
