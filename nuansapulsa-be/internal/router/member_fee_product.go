package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func MemberFeeProductRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewMemberFeeProductRepository(db)
	svc := service.NewMemberFeeProductService(repo)
	ctrl := controller.NewMemberFeeProductController(svc)

	mux.HandleFunc("/v1/admin/members/fee/products", wrap(requireAdmin(ctrl.List)))
	mux.HandleFunc("/v1/admin/members/fee/products/upsert", wrap(requireAdmin(ctrl.Upsert)))
	mux.HandleFunc("/v1/admin/members/fee/products/delete", wrap(requireAdmin(ctrl.Delete)))
}
