package auth

import (
	"errors"

	jwt "github.com/golang-jwt/jwt/v5"
)

var (
	ErrFingerprintIsEmpty     = errors.New("fingerprint is empty")
	ErrInvalidUUID            = errors.New("uuid is invalid")
	ErrCtxDoesntContainClaims = errors.New("context doesnt contain claims")
	ErrClaimsAssertionFailed  = errors.New("failed to assert claims")
)

// AccessClaims is claims of access token.
type AccessClaims struct {
	jwt.ClaimsValidator
	UserID      uint64 `json:"user_id"`
	Fingerprint string `json:"fingerprint"`
	// Payload may contains service-specific data like admin roles
	Payload []byte `json:"payload,omitempty"`
}

// Valid checks access claims validity.
func (c *AccessClaims) Valid() error {
	if err := c.ClaimsValidator.Validate(); err != nil {
		return err
	}

	if c.Fingerprint == "" {
		return ErrFingerprintIsEmpty
	}

	return nil
}
