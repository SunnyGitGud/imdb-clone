package db

import (
	"context"
	"time"
)

const deletePendingUser = `-- name: DeletePendingUser :exec
DELETE FROM pending_users
WHERE email = $1
`

func (q *Queries) DeletePendingUser(ctx context.Context, email string) error {
	_, err := q.db.ExecContext(ctx, deletePendingUser, email)
	return err
}

const getPendingUser = `-- name: GetPendingUser :one
SELECT email, hashed_password, otp, otp_expires
FROM pending_users
WHERE email = $1
`

type GetPendingUserRow struct {
	Email          string    `json:"email"`
	HashedPassword string    `json:"hashed_password"`
	Otp            string    `json:"otp"`
	OtpExpires     time.Time `json:"otp_expires"`
}

func (q *Queries) GetPendingUser(ctx context.Context, email string) (GetPendingUserRow, error) {
	row := q.db.QueryRowContext(ctx, getPendingUser, email)
	var i GetPendingUserRow
	err := row.Scan(
		&i.Email,
		&i.HashedPassword,
		&i.Otp,
		&i.OtpExpires,
	)
	return i, err
}

const upsertPendingUser = `-- name: UpsertPendingUser :exec
INSERT INTO pending_users (email, hashed_password, otp, otp_expires)
VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')
ON CONFLICT (email)
DO UPDATE SET
    otp = EXCLUDED.otp,
    otp_expires = NOW() + INTERVAL '5 minutes',
    hashed_password = EXCLUDED.hashed_password
`

type UpsertPendingUserParams struct {
	Email          string `json:"email"`
	HashedPassword string `json:"hashed_password"`
	Otp            string `json:"otp"`
}

func (q *Queries) UpsertPendingUser(ctx context.Context, arg UpsertPendingUserParams) error {
	_, err := q.db.ExecContext(ctx, upsertPendingUser, arg.Email, arg.HashedPassword, arg.Otp)
	return err
}
