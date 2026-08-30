package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/db"
	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/helper"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
	"nuansapulsa/javapay"
)

type JavapayInternalDeps struct {
	DB       *sql.DB
	JPClient *javapay.Client
}

func JavapayInternalRouter(mux *http.ServeMux, deps JavapayInternalDeps) {
	dbRepo := db.NewJavapayRepo(deps.DB)
	repo := repository.NewJavapayInternalRepository(dbRepo)
	svc := service.NewJavapayInternalService(repo, deps.JPClient)
	ctrl := controller.NewJavapayInternalController(svc)

	mux.HandleFunc("/internal/javapay/trx", helper.RequireInternalSecret(ctrl.HandleTrx))
	mux.HandleFunc("/internal/javapay/produk", helper.RequireInternalSecret(ctrl.HandleProduk))
}
