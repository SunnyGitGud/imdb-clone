-- name: GetUserByEmail :one
SELECT id, name, email, password_hashed
FROM users
WHERE email = $1
  AND time_deleted IS NULL;

-- name: UpdateLastLogin :exec
UPDATE users
SET last_login = $1
WHERE id = $2;

-- name: GetUserAccountDetails :one
SELECT id, name, email
FROM users
WHERE email = $1
  AND time_deleted IS NULL;


-- name: GetFavoriteMovies :many
SELECT m.id, m.tmdb_id, m.title, m.tagline, m.release_year,
       m.overview, m.score, m.popularity, m.language,
       m.poster_url, m.trailer_url
FROM movies m
JOIN user_movies um ON m.id = um.movie_id
WHERE um.user_id = $1
  AND um.relation_type = 'favorite';


-- name: GetWatchlistMovies :many
SELECT m.id, m.tmdb_id, m.title, m.tagline, m.release_year,
       m.overview, m.score, m.popularity, m.language,
       m.poster_url, m.trailer_url
FROM movies m
JOIN user_movies um ON m.id = um.movie_id
WHERE um.user_id = $1
  AND um.relation_type = 'watchlist';



