package controller

import "nuansapulsa/internal/service"

type ProviderCallbackController struct {
	svc *service.ProviderCallbackService
}

func NewProviderCallbackController(svc *service.ProviderCallbackService) *ProviderCallbackController {
	return &ProviderCallbackController{svc: svc}
}
