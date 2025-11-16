package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	db "github.com/sunnygitgud/imdb-clone/db/gen"
	"github.com/sunnygitgud/imdb-clone/logger"
	"github.com/sunnygitgud/imdb-clone/token"
)

// Define request structure
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Define request structure
type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	JWT     string `json:"jwt"`
}

type AccountHandler struct {
	Storage *db.Queries
	Logger  *logger.Logger
}

// Utility functions
func (h *AccountHandler) writeJSONResponse(w http.ResponseWriter, data any) error {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		h.Logger.Error("Failed to encode response", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return err
	}
	return nil
}

func (h *AccountHandler) handleStorageError(w http.ResponseWriter, err error, context string) bool {
	if err != nil {
		switch err {
		case db.ErrAuthenticationValidation, db.ErrUserAlreadyExists, db.ErrRegistrationValidation:
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: err.Error()})
			return true
		case db.ErrUserNotFound:
			http.Error(w, "User not found", http.StatusNotFound)
			return true
		default:
			h.Logger.Error(context, err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return true
		}
	}
	return false
}

func (h *AccountHandler) Register(w http.ResponseWriter, r *http.Request) {

	// Parse request body
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Logger.Error("Failed to decode registration request", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Register the user
	success, err := h.Storage.Register(req.Name, req.Email, req.Password)
	if h.handleStorageError(w, err, "Failed to register user") {
		return
	}

	// Return success response
	response := AuthResponse{
		Success: success,
		Message: "User registered successfully",
		JWT: token.CreateJWT(db.User{
			Email: req.Email,
			Name:  req.Name,
		}, *h.Logger),
	}

	if err := h.writeJSONResponse(w, response); err == nil {
		h.Logger.Info("Successfully registered user with email: " + req.Email)
	}
}

func (h *AccountHandler) Authenticate(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var req AuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Logger.Error("Failed to decode authentication request", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Authenticate the user
	success, err := h.Storage.Authenticate(req.Email, req.Password)
	if h.handleStorageError(w, err, "Failed to authenticate user") {
		return
	}

	// Return success response
	response := AuthResponse{
		Success: success,
		Message: "User Logged in successfully",
		JWT: token.CreateJWT(db.User{
			Email: req.Email,
		}, *h.Logger),
	}

	if err := h.writeJSONResponse(w, response); err == nil {
		h.Logger.Info("Successfully authenticated user with email: " + req.Email)
	}
}

func (h *AccountHandler) SaveToCollection(w http.ResponseWriter, r *http.Request) {
	type CollectionRequest struct {
		MovieID    int    `json:"movie_id"`
		Collection string `json:"collection"`
	}

	var req CollectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.Logger.Error("Failed to decode collection request", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	email, ok := r.Context().Value("email").(string)
	if !ok {
		http.Error(w, "Unable to retrieve email", http.StatusInternalServerError)
		return
	}

	success, err := h.Storage.SaveCollection(db.User{Email: email},
		req.MovieID, req.Collection)
	if h.handleStorageError(w, err, "Failed to save to collection") {
		return
	}

	response := AuthResponse{
		Success: success,
		Message: "Movie added to " + req.Collection + " successfully",
	}

	if err := h.writeJSONResponse(w, response); err == nil {
		h.Logger.Info("Successfully saved movie to " + req.Collection)
	}
}

func (h *AccountHandler) GetFavorites(w http.ResponseWriter, r *http.Request) {
	email, ok := r.Context().Value("email").(string)
	if !ok {
		http.Error(w, "Unable to retrieve email", http.StatusInternalServerError)
		return
	}
	details, err := h.Storage.GetAccountDetails(email)
	if err != nil {
		http.Error(w, "Unable to retrieve collections", http.StatusInternalServerError)
		return
	}
	if err := h.writeJSONResponse(w, details.Favorites); err == nil {
		h.Logger.Info("Successfully sent favorites")
	}
}

func (h *AccountHandler) GetWatchlist(w http.ResponseWriter, r *http.Request) {
	email, ok := r.Context().Value("email").(string)
	if !ok {
		http.Error(w, "Unable to retrieve email", http.StatusInternalServerError)
		return
	}
	details, err := h.Storage.GetAccountDetails(email)
	if err != nil {
		http.Error(w, "Unable to retrieve collections", http.StatusInternalServerError)
		return
	}
	if err := h.writeJSONResponse(w, details.Watchlist); err == nil {
		h.Logger.Info("Successfully sent favorites")
	}
}

func (h *AccountHandler) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := r.Header.Get("Authorization")
		if tokenStr == "" {
			http.Error(w, "Missing authorization token", http.StatusUnauthorized)
			return
		}

		// Remove "Bearer " prefix if present
		tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

		// Parse and validate the token

		token, err := jwt.Parse(tokenStr,
			func(t *jwt.Token) (any, error) {
				// Ensure the signing method is HMAC
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(token.GetJWTSecret(*h.Logger)), nil
			},
		)
		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract claims from the token
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Get the email from claims
		email, ok := claims["email"].(string)
		if !ok {
			http.Error(w, "Email not found in token", http.StatusUnauthorized)
			return
		}

		// Inject email into the request context
		ctx := context.WithValue(r.Context(), "email", email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
