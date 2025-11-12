package data

import "github.com/sunnygitgud/imdb-clone/db/gen"

type MovieStorage interface {
	GetTopMovies() []db.Movie
	GetRandomMovies() []db.Movie
}
