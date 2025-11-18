-- name: UpsertPendingUser :exec
INSERT INTO pending_users (email, hashed_password, otp, otp_expires)
VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')
ON CONFLICT (email)
DO UPDATE SET
    otp = EXCLUDED.otp,
    otp_expires = NOW() + INTERVAL '5 minutes',
    hashed_password = EXCLUDED.hashed_password;


-- name: GetPendingUser :one
SELECT email, hashed_password, otp, otp_expires
FROM pending_users
WHERE email = $1;


-- name: DeletePendingUser :exec
DELETE FROM pending_users
WHERE email = $1;


