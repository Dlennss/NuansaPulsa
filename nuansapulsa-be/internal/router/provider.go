package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func ProviderRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewProviderRepository(db)
	svc := service.NewProviderService(repo)
	ctrl := controller.NewProviderController(svc, "/v1/admin")

	mux.HandleFunc("/v1/admin/provider", wrap(requireAdmin(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/provider/", wrap(requireAdmin(ctrl.Handle)))
}
