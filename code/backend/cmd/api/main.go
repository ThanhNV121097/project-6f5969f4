package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/ThanhNV121097/project-6f5969f4/backend/internal/migrations"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type server struct {
	db *sql.DB
}

type healthResponse struct {
	Status string `json:"status"`
}

type errorEnvelope struct {
	Error apiError `json:"error"`
}

type apiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required")
	}

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := migrations.Apply(ctx, db); err != nil {
		log.Fatalf("apply migrations: %v", err)
	}

	srv := &server{db: db}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", srv.healthz)

	addr := ":" + listenPort()
	log.Printf("backend listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("listen: %v", err)
	}
}

func listenPort() string {
	if port := os.Getenv("PORT"); port != "" {
		return port
	}
	if port := os.Getenv("APP_PORT"); port != "" {
		return port
	}
	return "8080"
}

func (s *server) healthz(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	if err := s.db.PingContext(ctx); err != nil {
		log.Printf("health database ping failed: %v", err)
		writeError(w, http.StatusServiceUnavailable, "service_unavailable", "service unavailable")
		return
	}

	var one int
	if err := s.db.QueryRowContext(ctx, "select 1").Scan(&one); err != nil || one != 1 {
		log.Printf("health select failed: %v", err)
		writeError(w, http.StatusServiceUnavailable, "service_unavailable", "service unavailable")
		return
	}

	writeJSON(w, http.StatusOK, healthResponse{Status: "ok"})
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("write response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, code string, message string) {
	writeJSON(w, status, errorEnvelope{Error: apiError{Code: code, Message: message}})
}
