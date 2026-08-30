package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/helper"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func ProviderRekeningRouter(mux *http.ServeMux, wrap Middleware, db *sql.DB) {
	repo := repository.NewProviderRekeningRepository(db)
	svc := service.NewProviderRekeningService(repo)
	ctrl := controller.NewProviderRekeningController(svc)
	roles := helper.RequireRoles("admin", "operator_wallet")

	mux.HandleFunc("/v1/admin/provider-accounts", wrap(roles(ctrl.Handle)))
	mux.HandleFunc("/v1/admin/provider-accounts/", wrap(roles(ctrl.Handle)))
}
