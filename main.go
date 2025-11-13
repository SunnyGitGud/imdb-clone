package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/sunnygitgud/imdb-clone/db/gen"
	"github.com/sunnygitgud/imdb-clone/handler"
	"github.com/sunnygitgud/imdb-clone/logger"
)

func loggerInit() *logger.Logger {
	logInstance, err := logger.NewLogger("movie.log")
	if err != nil {
		log.Fatalf("failed to initialize logger %v", err)
	}
	defer logInstance.Close()
	return logInstance
}

func main() {

	logInstance := loggerInit()

	if err := godotenv.Load(); err != nil {
		log.Fatalf("no .env file was available")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatalf("DB_URL not set")
	}

	dbpsql, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("failed to connect to psql %v", err)
	}
	defer dbpsql.Close()

	movieHandler := handler.MovieHandler{
		Repo: db.New(dbpsql),
		Log:  logInstance,
	}

	http.HandleFunc("/api/movies/top", movieHandler.GetTopMovies)
	http.HandleFunc("/api/movies/random", movieHandler.GetRandomMovies)
	http.HandleFunc("/api/movies/", movieHandler.GetMovieById)
	http.HandleFunc("/api/movies/search", movieHandler.SearchMovies)
	http.HandleFunc("/api/genre/", movieHandler.GetMovieGenre)

	const addr = ":8080"
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server has failed %v", err)
		logInstance.Error("server failed", err)
	}
}
