package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/helper"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func ProviderMerchantIDRouter(mux *http.ServeMux, wrap Middleware, db *sql.DB) {
	repo := repository.NewProviderMerchantIDRepository(db)
	svc := service.NewProviderMerchantIDService(repo)
	ctrl := controller.NewProviderMerchantIDController(svc)
	roles := helper.RequireRoles("admin")

	mux.HandleFunc("/v1/admin/provider-merchant-ids", wrap(roles(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/provider-merchant-ids/", wrap(roles(ctrl.Handle)))
}
