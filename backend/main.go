package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)


func main() {
	loadEnv()

	router := chi.NewRouter()
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})

	log.Println("server was startet on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}


func loadEnv() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
