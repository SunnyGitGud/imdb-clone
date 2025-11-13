package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

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

func (h *MovieHandler) parseID(w http.ResponseWriter, idStr string) (int, bool) {
	id, err := strconv.Atoi(idStr)
	if err != nil {
		h.Log.Error("Invalid Id Format", err)
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return 0, false
	}
	return id, true

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

func (h *MovieHandler) GetMovieById(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	idStr := r.URL.Path[len("/api/movies/"):]
	id, ok := h.parseID(w, idStr)
	if !ok {
		return
	}
	movies, err := h.Repo.GetMoviesById(ctx, int32(id))
	if err != nil {
		h.Log.Error("failed to get movies:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	h.writeJsonResponse(w, movies)
}

func (h *MovieHandler) SearchMovies(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	query := r.URL.Query().Get("q")
	order := r.URL.Query().Get("order")
	genreStr := r.URL.Query().Get("genre")
	genreID := 0

	if genreStr != "" {
		if g, err := strconv.Atoi(genreStr); err != nil {
			genreID = g
		}
	}
	var limit int32 = 10
	param := db.SearchMoviesParams{
		SearchTerm:  query,
		OrderBy:     order,
		GenreID:     int32(genreID),
		ResultLimit: limit,
	}
	movies, err := h.Repo.SearchMovies(ctx, param)
	if err != nil {
		h.Log.Error("failed to get movies:", err)
		http.Error(w, "Failed to fetch top movies", http.StatusInternalServerError)
		return
	}
	h.writeJsonResponse(w, movies)
}
