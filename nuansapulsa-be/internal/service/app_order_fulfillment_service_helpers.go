package service

import (
	"context"
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"nuansapulsa/gemilang"
	"nuansapulsa/internal/helper"
	providerpkg "nuansapulsa/internal/provider"
	"nuansapulsa/internal/repository"
	"nuansapulsa/yuscom"
)

var Pulsa24JamFixedWalletAmountPattern = regexp.MustCompile(`([0-9]+)$`)

type pulsa24JamAppRequest struct {
	Product string
	Qty     int64
	Dest    string
}

func (s *AppOrderFulfillmentService) handleFailedOrder(ctx context.Context, order *repository.AppOrderRow, providerTrxID int64, msg, reasonPrefix string) error {
	if order == nil {
		return fmt.Errorf("order not found")
	}

	reason := strings.TrimSpace(reasonPrefix)
	if reason == "" {
		reason = "transaksi provider aplikasi gagal"
	}
	if strings.TrimSpace(msg) != "" {
		reason = fmt.Sprintf("%s: %s", reason, strings.TrimSpace(msg))
	}

	if order.BuyerType == "user" && order.MemberID != nil && *order.MemberID > 0 && order.HargaFinal > 0 {
		if err := s.callbackRepo.RefundAppOrderFunding(ctx, *order.MemberID, order.InvoiceID, "refund saldo otomatis: "+reason); err != nil {
			_ = s.orderRepo.UpdateStatusByID(ctx, order.ID, "failed")
			return fmt.Errorf("refund app order gagal member_id=%d invoice=%s err=%w", *order.MemberID, order.InvoiceID, err)
		}
		if err := s.orderRepo.UpdateStatusByID(ctx, order.ID, "refunded"); err != nil {
			return err
		}
		helper.AppendProviderServiceLog("provider_wallet.log", "app order dispatch fail refunded member_id=%d invoice=%s provider_trx_id=%d", *order.MemberID, order.InvoiceID, providerTrxID)
		return nil
	}

	if strings.TrimSpace(strings.ToLower(order.BuyerType)) == "guest" && order.HargaFinal > 0 {
		if err := s.orderRepo.UpsertGuestRefundTicket(ctx, order, "refund guest pending claim: "+reason); err != nil {
			helper.AppendProviderServiceLog("provider_callback_service.log", "guest refund ticket create failed invoice=%s provider_trx_id=%d err=%v", order.InvoiceID, providerTrxID, err)
		}
	}

	return s.orderRepo.UpdateStatusByID(ctx, order.ID, "failed")
}

func appOrderProviderLooksLikeSystemIssue(provider, body string) bool {
	switch strings.TrimSpace(strings.ToLower(provider)) {
	case "gemilang":
		return gemilang.LooksLikeSystemIssue(body)
	case "pulsa24jam":
		upper := strings.ToUpper(strings.TrimSpace(body))
		return strings.Contains(upper, "TIMEOUT") || strings.Contains(upper, "SYSTEM ERROR") || strings.Contains(upper, "MAINTENANCE")
	default:
		return yuscom.LooksLikeSystemIssue(body)
	}
}

func appOrderProviderImmediateReject(provider, body string) bool {
	switch strings.TrimSpace(strings.ToLower(provider)) {
	case "gemilang":
		return helper.LooksLikeGemilangImmediateReject(body)
	case "pulsa24jam":
		upper := strings.ToUpper(strings.TrimSpace(body))
		return strings.Contains(upper, "GAGAL") ||
			strings.Contains(upper, "FAILED") ||
			strings.Contains(upper, "SALDO TIDAK CUKUP") ||
			strings.Contains(upper, `"STATUS":3`) ||
			strings.Contains(upper, `"STATUS":"3"`) ||
			strings.Contains(upper, `"STATUS":"FAILED"`) ||
			strings.Contains(upper, `"SUCCESS":FALSE`)
	default:
		return helper.LooksLikeYuscomImmediateReject(body)
	}
}

func appOrderProviderProductUnavailable(provider, body string) bool {
	if !strings.EqualFold(strings.TrimSpace(provider), providerpkg.Pulsa24JamProviderName) {
		return false
	}
	upper := strings.ToUpper(strings.TrimSpace(body))
	return strings.Contains(upper, "PRODUK KEHABISAN STOK") ||
		strings.Contains(upper, "PRODUCT OUT OF STOCK")
}

func resolvePulsa24JamAppRequest(providerProductCode string, order *repository.AppOrderRow) pulsa24JamAppRequest {
	providerProductCode = strings.ToUpper(strings.TrimSpace(providerProductCode))
	if order == nil {
		return pulsa24JamAppRequest{Product: providerProductCode}
	}
	qty := order.Qty
	if qty <= 0 {
		qty = 1
	}
	dest := strings.TrimSpace(order.Dest)
	if qty != 1 {
		if pulsa24JamUsesNominalAtPhoneFormat(providerProductCode, order) {
			return pulsa24JamAppRequest{
				Product: providerProductCode,
				Qty:     0,
				Dest:    fmt.Sprintf("%d@%s", qty, dest),
			}
		}
		return pulsa24JamAppRequest{Product: providerProductCode, Qty: qty, Dest: dest}
	}

	sku := strings.ToUpper(strings.TrimSpace(order.ProdukSKUSnapshot))
	name := strings.ToUpper(strings.TrimSpace(order.ProdukNamaSnapshot))
	genericCode := ""
	switch {
	case strings.HasPrefix(sku, "UDDND") && strings.Contains(name, "DANA"):
		genericCode = "DANA"
	case (strings.HasPrefix(sku, "UDGP") || strings.HasPrefix(sku, "UDGY")) && strings.Contains(name, "GOPAY") && !strings.Contains(name, "DRIVER"):
		genericCode = "GOPAY"
	default:
		return pulsa24JamAppRequest{Product: providerProductCode, Qty: qty, Dest: dest}
	}

	match := Pulsa24JamFixedWalletAmountPattern.FindStringSubmatch(sku)
	if len(match) != 2 {
		return pulsa24JamAppRequest{Product: providerProductCode, Qty: qty, Dest: dest}
	}
	thousands, err := strconv.ParseInt(match[1], 10, 64)
	if err != nil || thousands <= 0 {
		return pulsa24JamAppRequest{Product: providerProductCode, Qty: qty, Dest: dest}
	}
	amount := thousands * 1000
	if amount <= 0 || (order.HargaDasar > 0 && amount >= order.HargaDasar) {
		return pulsa24JamAppRequest{Product: providerProductCode, Qty: qty, Dest: dest}
	}
	return pulsa24JamAppRequest{
		Product: genericCode,
		Qty:     0,
		Dest:    fmt.Sprintf("%d@%s", amount, dest),
	}
}

func pulsa24JamUsesNominalAtPhoneFormat(providerProductCode string, order *repository.AppOrderRow) bool {
	code := strings.ToUpper(strings.TrimSpace(providerProductCode))
	name := strings.ToUpper(strings.TrimSpace(order.ProdukNamaSnapshot))
	sku := strings.ToUpper(strings.TrimSpace(order.ProdukSKUSnapshot))

	if strings.Contains(name, "NOMINAL@NOHP") || strings.Contains(name, "NOMINAL @ NOHP") {
		return true
	}
	if code == "PPOBGOPAY" || code == "PPOBDANA" {
		return true
	}
	if sku == "PPOBGOPAY" || sku == "PPOBDANA" {
		return true
	}
	return false
}

func pulsa24JamFixedPulsaQty(providerQty int64, order *repository.AppOrderRow) int64 {
	if order == nil || providerQty != 1 || order.Nominal <= 0 {
		return 0
	}
	name := strings.ToUpper(strings.TrimSpace(order.ProdukNamaSnapshot))
	if !strings.Contains(name, "PULSA") {
		return 0
	}
	if !strings.Contains(name, "OPEN AMOUNT") &&
		!strings.Contains(name, "NOMINAL BEBAS") &&
		!strings.Contains(name, "NOMINAL@NOHP") &&
		!strings.Contains(name, "NOMINAL @ NOHP") {
		return order.Nominal
	}
	return 0
}

func appOrderProviderLooksLikeAccepted(provider, body string) bool {
	switch strings.TrimSpace(strings.ToLower(provider)) {
	case "gemilang":
		return helper.LooksLikeGemilangAccepted(body) || helper.LooksLikeGemilangSuccess(body)
	case "pulsa24jam":
		if appOrderProviderImmediateReject(provider, body) {
			return false
		}
		upper := strings.ToUpper(strings.TrimSpace(body))
		return strings.Contains(upper, "SUKSES") ||
			strings.Contains(upper, "SUCCESS") ||
			strings.Contains(upper, "PENDING") ||
			strings.Contains(upper, `"OK":TRUE`) ||
			strings.Contains(upper, `"SUCCESS":TRUE`) ||
			strings.Contains(upper, `"RC":"00"`)
	default:
		return helper.LooksLikeYuscomAccepted(body) || strings.Contains(strings.ToUpper(strings.TrimSpace(body)), "SUKSES")
	}
}
