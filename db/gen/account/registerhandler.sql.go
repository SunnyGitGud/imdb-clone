package db

import (
	"context"
	"database/sql"
	"time"

	"errors"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrRegistrationValidation   = errors.New("registration validation failed")
	ErrUserAlreadyExists        = errors.New("user already exists")
	ErrAuthenticationValidation = errors.New("authentication failed")
	ErrUserNotFound             = errors.New("user not found")
)

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
	if err != sql.ErrNoRows {
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
