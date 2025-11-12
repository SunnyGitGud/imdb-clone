-- name: GetTopMovies :many
SELECT
  id,
  tmdb_id,
  title,
  tagline,
  release_year,
  overview,
  popularity,
  language,
  poster_url,
  trailer_url
FROM movies
ORDER BY popularity DESC
LIMIT $1;


-- name: GetRandomMovies :many
SELECT
  id,
  tmdb_id,
  title,
  tagline,
  release_year,
  overview,
  popularity,
  language,
  poster_url,
  trailer_url
FROM movies
ORDER BY random() DESC
LIMIT $1;


-- name: GetMoviesById :one 
SELECT id, tmdb_id, title, tagline, release_year, overview, score, popularity, language, poster_url, trailer_url
		FROM movies
		WHERE id = $1;


-- name: SearchMovies :many
SELECT
  id,
  tmdb_id,
  title,
  tagline,
  release_year,
  overview,
  score,
  popularity,
  language,
  poster_url,
  trailer_url
FROM movies
WHERE (title ILIKE $1 OR overview ILIKE $1)
  AND (
    $2::int IS NULL OR
    EXISTS (
      SELECT 1 FROM movie_genres
      WHERE movie_id = movies.id AND genre_id = $2
    )
  )
ORDER BY
  CASE
    WHEN $3 = 'score' THEN score
    WHEN $3 = 'name' THEN title
    WHEN $3 = 'date' THEN release_year
    ELSE popularity
  END DESC
LIMIT $4;


--name: GetAllGenre :many 
SELECT id, name FROM genres ORDER BY id;


-- name: GetGenresByMovie :many
SELECT
  g.id,
  g.name
FROM genres g
JOIN movie_genres mg ON g.id = mg.genre_id
WHERE mg.movie_id = $1;


-- name: GetActorsByMovie :many
SELECT
  a.id,
  a.first_name,
  a.last_name,
  a.image_url
FROM actors a
JOIN movie_cast mc ON a.id = mc.actor_id
WHERE mc.movie_id = $1;


-- name: GetKeywordsByMovie :many
SELECT
  k.word
FROM keywords k
JOIN movie_keywords mk ON k.id = mk.keyword_id
WHERE mk.movie_id = $1;

