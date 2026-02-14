package models

import (
	"time"
)

type Transaction struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	BountyID  uint      `json:"bounty_id" gorm:"not null"`
	Amount    float64   `json:"amount" gorm:"type:decimal(10,2);not null"`
	Type      string    `json:"type" gorm:"type:enum('ESCROW','RELEASE','REFUND');not null"`
	CreatedAt time.Time `json:"created_at"`
	
	// Relations
	Bounty Bounty `json:"bounty,omitempty" gorm:"foreignKey:BountyID"`
}

func (Transaction) TableName() string {
	return "transactions"
}
