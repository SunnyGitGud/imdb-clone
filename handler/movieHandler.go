package handler

import (
	"encoding/json"
	"net/http"

	"github.com/sunnygitgud/imdb-clone/db/gen"
	"github.com/sunnygitgud/imdb-clone/logger"
)

type MovieHandler struct {
	Repo *db.Queries
	Log  *logger.Logger
}

func (h *MovieHandler) writeJsonResponse(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (h *MovieHandler) GetTopMovies(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	movies, err := h.Repo.GetTopMovies(ctx, 10)
	if err != nil {
		h.Log.Error("failed to get movies:", err)
		http.Error(w, "Failed to fetch top movies", http.StatusInternalServerError)
		return
	}
	h.writeJsonResponse(w, movies)
}

func (h *MovieHandler) GetRandomMovies(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	movies, err := h.Repo.GetRandomMovies(ctx, 10)
	if err != nil {
		h.Log.Error("failed to get movies:", err)
		http.Error(w, "Failed to fetch top movies", http.StatusInternalServerError)
		return
	}
	h.writeJsonResponse(w, movies)
}
