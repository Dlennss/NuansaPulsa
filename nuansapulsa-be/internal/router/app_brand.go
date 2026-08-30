package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func AppBrandRouter(mux *http.ServeMux, db *sql.DB) {
	repo := repository.NewAppBrandRepository(db)
	svc := service.NewAppBrandService(repo)
	ctrl := controller.NewAppBrandController(svc, "/v1/app")

	mux.HandleFunc("/v1/app/brand", ctrl.Handle)
}
