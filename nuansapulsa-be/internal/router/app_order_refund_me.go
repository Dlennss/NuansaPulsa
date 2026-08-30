package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func AppOrderRefundMeRouter(mux *http.ServeMux, db *sql.DB, jwtSecret []byte) {
	orderRepo := repository.NewAppOrderRepository(db)
	svc := service.NewAppOrderRefundService(orderRepo)
	ctrl := controller.NewAppOrderRefundMeController(svc, jwtSecret)

	mux.HandleFunc("/v1/app/me/refunds/claim", ctrl.HandleClaim)
}
