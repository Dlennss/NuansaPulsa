package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func ProdukRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewProdukRepository(db)
	svc := service.NewProdukService(repo)
	ctrl := controller.NewProdukController(svc, "/v1/admin")

	mux.HandleFunc("/v1/admin/produk", wrap(requireAdmin(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/produk/", wrap(requireAdmin(ctrl.Handle)))
}
