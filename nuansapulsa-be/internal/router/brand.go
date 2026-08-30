package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func BrandRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewBrandRepository(db)
	svc := service.NewBrandService(repo)
	ctrl := controller.NewBrandController(svc, "/v1/admin")

	mux.HandleFunc("/v1/admin/brand", wrap(requireAdmin(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/brand/", wrap(requireAdmin(ctrl.Handle)))
}
