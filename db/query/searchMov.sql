-- name: SearchMovies :many
SELECT 
  id, tmdb_id, title, tagline, release_year, overview, score, 
  popularity, language, poster_url, trailer_url
FROM movies
WHERE (title ILIKE @search_term OR overview ILIKE @search_term)
  AND (
    @genre_id::int IS NULL OR EXISTS (
      SELECT 1 FROM movie_genres mg 
      WHERE mg.movie_id = movies.id AND mg.genre_id = @genre_id
    )
  )
ORDER BY 
  CASE 
    WHEN @order_by::text = 'score' THEN score
    WHEN @order_by::text = 'popularity' THEN popularity
    ELSE 0
  END DESC,
  CASE WHEN @order_by::text = 'name' THEN title ELSE '' END ASC,
  CASE WHEN @order_by::text = 'date' THEN release_year ELSE 0 END DESC,
  CASE WHEN @order_by::text IS NULL OR @order_by::text = '' THEN popularity ELSE 0 END DESC
LIMIT @result_limit;
