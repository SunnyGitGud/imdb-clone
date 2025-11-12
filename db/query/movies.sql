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
