package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func MemberFeeCategoryRouter(mux *http.ServeMux, wrap Middleware, requireAdmin Middleware, db *sql.DB) {
	repo := repository.NewMemberFeeCategoryRepository(db)
	svc := service.NewMemberFeeCategoryService(repo)
	ctrl := controller.NewMemberFeeCategoryController(svc)

	mux.HandleFunc("/v1/admin/members/fee/categories", wrap(requireAdmin(ctrl.List)))
	mux.HandleFunc("/v1/admin/members/fee/categories/upsert", wrap(requireAdmin(ctrl.Upsert)))
	mux.HandleFunc("/v1/admin/members/fee/categories/delete", wrap(requireAdmin(ctrl.Delete)))
}
