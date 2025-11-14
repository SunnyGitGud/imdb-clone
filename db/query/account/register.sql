-- name: CheckUserExists :one
SELECT EXISTS(
    SELECT 1 FROM users WHERE email = $1
) AS exists;


-- name: RegisterUser :one
INSERT INTO users (name, email, password_hashed, time_created)
VALUES ($1, $2, $3, $4)
RETURNING id;

