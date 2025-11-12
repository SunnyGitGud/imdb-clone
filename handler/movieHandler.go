package handler

import (
	"encoding/json"
	"github.com/sunnygitgud/imdb-clone/models"
	"net/http"
)

type MovieHandler struct {
}

func (h *MovieHandler) GetTopMovies(w http.ResponseWriter, r *http.Request) {
	movies := []models.Movies{
		{
			ID:          1,
			TMDB_ID:     1231,
			Title:       "sunny",
			ReleaseYear: 2002,
			Ganre:       []models.Ganre{{ID: 1, Name: "happy"}},
			Keywords:    []string{},
			Casting:     []models.Actor{{ID: 1, FirstName: "sunny", LastName: "yadav"}},
		},
		{
			ID:          2,
			TMDB_ID:     123,
			Title:       "ankita",
			ReleaseYear: 2006,
			Ganre:       []models.Ganre{{ID: 1, Name: "angry"}},
			Keywords:    []string{},
			Casting:     []models.Actor{{ID: 1, FirstName: "ankita", LastName: "yadav"}},
		},
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(movies); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
