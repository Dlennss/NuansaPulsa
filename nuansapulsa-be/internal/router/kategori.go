package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func KategoriRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewKategoriRepository(db)
	svc := service.NewKategoriService(repo)
	ctrl := controller.NewKategoriController(svc, "/v1/admin")

	mux.HandleFunc("/v1/admin/kategori", wrap(requireAdmin(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/kategori/", wrap(requireAdmin(ctrl.Handle)))
}
