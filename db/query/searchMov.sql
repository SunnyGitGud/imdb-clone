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


