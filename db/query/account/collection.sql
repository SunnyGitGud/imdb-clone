-- name: GetUserIdByEmail :one
SELECT id
FROM users
WHERE email = $1
  AND time_deleted IS NULL;

-- name: CheckUserMovieRelationExists :one
SELECT EXISTS(
    SELECT 1
    FROM user_movies
    WHERE user_id = $1
      AND movie_id = $2
      AND relation_type = $3
);


-- name: InsertUserMovieRelation :exec
INSERT INTO user_movies (user_id, movie_id, relation_type, time_added)
VALUES ($1, $2, $3, NOW());


-- name: DeleteUserMovieRelation :exec
DELETE FROM user_movies
WHERE user_id = $1
  AND movie_id = $2
  AND relation_type = $3;


-- name: GetUserMovieRelations :many
SELECT user_id, movie_id, relation_type, time_added
FROM user_movies
WHERE user_id = $1
  AND movie_id = $2;

