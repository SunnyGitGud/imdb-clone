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



