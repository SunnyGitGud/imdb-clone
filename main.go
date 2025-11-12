package main

import (
	"log"
	"net/http"

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
	http.Handle("/", http.FileServer(http.Dir("public")))

	movieHandler := handler.MovieHandler{}
	http.HandleFunc("/api/movies/top", movieHandler.GetTopMovies)

	const addr = ":8080"
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatalf("Server has failed %v", err)
		logInstance.Error("server failed", err)
	}
}
