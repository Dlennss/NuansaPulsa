package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func ProdukAppPricingRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewProdukAppPricingRepository(db)
	svc := service.NewProdukAppPricingService(repo)
	ctrl := controller.NewProdukAppPricingController(svc, "/v1/admin")

	mux.HandleFunc("/v1/admin/produk-app-pricing", wrap(requireAdmin(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/produk-app-pricing/", wrap(requireAdmin(ctrl.Handle)))
}
