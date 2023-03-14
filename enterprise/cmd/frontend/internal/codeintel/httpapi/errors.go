package httpapi

import "github.com/cockroachdb/errors"

type ClientError struct {
	err error
}

func (e *ClientError) Error() string {
	return e.err.Error()
}

func clientError(message string, vals ...any) error {
	return &ClientError{err: errors.Errorf(message, vals...)}
}
