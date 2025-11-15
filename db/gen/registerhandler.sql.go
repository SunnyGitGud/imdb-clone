package db

import (
	"context"
	"database/sql"
	"time"

	"errors"

	"github.com/sunnygitgud/imdb-clone/logger"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrRegistrationValidation   = errors.New("registration validation failed")
	ErrUserAlreadyExists        = errors.New("user already exists")
	ErrAuthenticationValidation = errors.New("authentication failed")
	ErrUserNotFound             = errors.New("user not found")
)

type AccountRepository struct {
	*Queries
	logger *logger.Logger
}

func NewAccountRepository(db *sql.DB, log *logger.Logger) *AccountRepository {
	return &AccountRepository{
		Queries: New(db), // Use sqlc's New() function
		logger:  log,
	}
}

func (q *Queries) Register(name, email, password string) (bool, error) {
	if name == "" || email == "" || password == "" {
		return false, ErrRegistrationValidation
	}

	exists, err := q.CheckUserExists(context.Background(), email)
	if err != nil {
		return false, err
	}
	if exists {
		return false, ErrUserAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return false, err
	}

	userID, err := q.RegisterUser(context.Background(), RegisterUserParams{
		Name:           name,
		Email:          email,
		PasswordHashed: string(hashedPassword),
		TimeCreated:    time.Now(),
	})
	if err != nil {
		return false, err
	}

	_ = userID

	return true, nil
}

func (q *Queries) Authenticate(email, password string) (bool, error) {
	if email == "" || password == "" {
		return false, ErrAuthenticationValidation
	}

	user, err := q.GetUserByEmail(context.Background(), email)
	if err == sql.ErrNoRows {
		return false, ErrAuthenticationValidation
	}
	if err != nil {
		return false, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHashed), []byte(password)); err != nil {
		return false, ErrAuthenticationValidation
	}

	_ = q.UpdateLastLogin(context.Background(), UpdateLastLoginParams{
		LastLogin: sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		},
		ID: user.ID,
	})
	return true, nil
}

func (q *Queries) GetAccountDetails(email string) (User, error) {
	ctx := context.Background()

	userRow, err := q.GetUserAccountDetails(ctx, email)
	if err == sql.ErrNoRows {
		return User{}, err
	}
	if err != nil {
		return User{}, err
	}

	user := User{
		ID:    userRow.ID,
		Name:  userRow.Name,
		Email: userRow.Email,
	}

	favorites, err := q.GetFavoriteMovies(ctx, user.ID)
	if err != nil {
		return user, err
	}

	user.Favorites = favorites

	watchlist, err := q.GetWatchlistMovies(ctx, user.ID)
	if err != nil {
		return user, err
	}

	user.Watchlist = watchlist
	return user, nil
}

func (q *Queries) SaveCollection(user User, movieID int, collection string) (bool, error) {
	ctx := context.Background()

	if movieID <= 0 {
		return false, errors.New("Invalid movie ID")
	}

	if collection != "favorite" && collection != "watchlist" {
		return false, errors.New("collection must be 'favorite' or 'watchlist'")
	}

	// Get user ID
	userID, err := q.GetUserIdByEmail(ctx, user.Email)
	if err == sql.ErrNoRows {
		return false, ErrUserNotFound
	}
	if err != nil {
		return false, err
	}

	// Check if relation exists
	exists, err := q.CheckUserMovieRelationExists(ctx,
		CheckUserMovieRelationExistsParams{
			UserID:       userID,
			MovieID:      int32(movieID),
			RelationType: collection,
		},
	)
	if err != nil {
		return false, err
	}

	if exists {
		return true, nil // already added
	}

	// Insert new relation
	err = q.InsertUserMovieRelation(ctx,
		InsertUserMovieRelationParams{
			UserID:       userID,
			MovieID:      int32(movieID),
			RelationType: collection,
		},
	)
	if err != nil {
		return false, err
	}

	return true, nil
}
