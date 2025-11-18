-- name: GetMoviesByActorId :many
SELECT m.id as movie_id, m.title, m.release_year, m.poster_url, a.*
FROM movies m
JOIN movie_cast mc ON mc.movie_id = m.id
JOIN actors a ON a.id = mc.actor_id
WHERE mc.actor_id = $1;

