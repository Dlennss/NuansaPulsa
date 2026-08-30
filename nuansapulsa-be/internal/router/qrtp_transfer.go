package router

import (
	"database/sql"
	"net/http"

	"nuansapulsa/internal/controller"
	"nuansapulsa/internal/helper"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
	"nuansapulsa/internal/tukangpay"
)

func QRTPTransferRouter(mux *http.ServeMux, wrap Middleware, db *sql.DB) {
	repo := repository.NewQRTPTransferRepository(db)
	svc := service.NewQRTPTransferService(repo, tukangpay.NewFromEnv())
	ctrl := controller.NewQRTPTransferController(svc)
	roles := helper.RequireRoles("admin", "operator_wallet")

	mux.HandleFunc("/v1/admin/qrtp/summary", wrap(roles(ctrl.Summary)))
	mux.HandleFunc("/v1/admin/qrtp/provider-balances", wrap(roles(ctrl.ProviderBalances)))
	mux.HandleFunc("/v1/admin/qrtp/transfers", wrap(roles(ctrl.List)))
	mux.HandleFunc("/v1/admin/qrtp/transfers/inquiry", wrap(roles(ctrl.Inquiry)))
	mux.HandleFunc("/v1/admin/qrtp/transfers/", wrap(roles(ctrl.Process)))
	mux.HandleFunc("/v1/webhook/tukangpay/payout", ctrl.TukangPayCallback)
}
