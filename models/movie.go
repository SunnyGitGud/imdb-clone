package models

type Movies struct {
	ID          int
	TMDB_ID     int
	Title       string
	Tag         string
	ReleaseYear int
	Ganre       []Ganre
	Score       *float32
	Popularity  *float32
	Keywords    []string
	Language    *string
	PosterURL   *string
	TrailerURL  *string
	Casting     []Actor
}
