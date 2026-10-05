package service

import (
	"testing"

	"nuansapulsa/internal/repository"
)

func TestAppOrderProviderImmediateRejectPulsa24Jam(t *testing.T) {
	tests := []struct {
		name string
		body string
		want bool
	}{
		{
			name: "insufficient provider balance",
			body: `{"message":"saldo tidak cukup","ok":true,"refid":"INV-1","status":3}`,
			want: true,
		},
		{
			name: "numeric rejected status",
			body: `{"message":"produk tidak ditemukan","ok":true,"refid":"INV-2","status":3}`,
			want: true,
		},
		{
			name: "pending accepted",
			body: `{"message":"Transaksi sedang diproses","ok":true,"refid":"INV-3","status":"pending"}`,
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := appOrderProviderImmediateReject("Pulsa24Jam", tt.body); got != tt.want {
				t.Fatalf("appOrderProviderImmediateReject() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestAppOrderProviderPulsa24JamRejectIsNotAccepted(t *testing.T) {
	rejectedBodies := []string{
		`{"message":"saldo tidak cukup","ok":true,"success":false,"refid":"NP260924120000ABCDEF","status":3}`,
		`{"message":"produk tidak ditemukan","ok":true,"refid":"NP260924120000ABCDEF","status":3}`,
		`{"ok":false,"message":"PIN salah"}`,
	}
	for _, body := range rejectedBodies {
		if appOrderProviderLooksLikeAccepted("Pulsa24Jam", body) {
			t.Fatalf("rejected Pulsa24Jam body must not be accepted: %s", body)
		}
	}
}

func TestAppOrderProviderProductUnavailable(t *testing.T) {
	if !appOrderProviderProductUnavailable("Pulsa24Jam", `{"message":"Produk kehabisan stok","status":3}`) {
		t.Fatal("out-of-stock response should quarantine the product")
	}
	if appOrderProviderProductUnavailable("Pulsa24Jam", `{"message":"Nomor tujuan salah","status":3}`) {
		t.Fatal("business rejection unrelated to stock must not quarantine the product")
	}
	if appOrderProviderProductUnavailable("yuscom", `{"message":"Produk kehabisan stok","status":3}`) {
		t.Fatal("only Pulsa24Jam products should be quarantined")
	}
}

func TestResolvePulsa24JamAppRequest(t *testing.T) {
	tests := []struct {
		name        string
		order       repository.AppOrderRow
		wantProduct string
		wantQty     int64
		wantDest    string
	}{
		{
			name:        "fixed dana uses open amount route",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "UDDND10", ProdukNamaSnapshot: "Dana 10.000", Dest: "08571187308", Qty: 1, HargaDasar: 11055},
			wantProduct: "DANA", wantQty: 0, wantDest: "10000@08571187308",
		},
		{
			name:        "fixed gopay uses open amount route",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "UDGP10", ProdukNamaSnapshot: "Gopay 10.000", Dest: "08571187308", Qty: 1, HargaDasar: 11650},
			wantProduct: "GOPAY", wantQty: 0, wantDest: "10000@08571187308",
		},
		{
			name:        "gopay driver keeps dedicated route",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "UDGD15", ProdukNamaSnapshot: "Gopay Driver 15.000", Dest: "08571187308", Qty: 1, HargaDasar: 16450},
			wantProduct: "UDGD15", wantQty: 1, wantDest: "08571187308",
		},
		{
			name:        "generic dana open amount keeps qty field",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "DANA", ProdukNamaSnapshot: "Dana Bebas Nominal", Dest: "08571187308", Qty: 25000, HargaDasar: 26000},
			wantProduct: "DANA", wantQty: 25000, wantDest: "08571187308",
		},
		{
			name:        "gopay h2hr open amount keeps qty field",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "GOPAY", ProdukNamaSnapshot: "E-WALLET 2.500 GOPAY OPEN AMOUNT", Dest: "08571187308", Qty: 100000, HargaDasar: 101200},
			wantProduct: "GOPAY", wantQty: 100000, wantDest: "08571187308",
		},
		{
			name:        "gopay ppob nominal at phone product uses destination format",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "PPOBGOPAY", ProdukNamaSnapshot: "GOPAY CUSTOMER DENOM BEBAS 1.250 (FORMAT: NOMINAL@NOHP)", Dest: "08571187308", Qty: 100000, HargaDasar: 101200},
			wantProduct: "PPOBGOPAY", wantQty: 0, wantDest: "100000@08571187308",
		},
		{
			name:        "unknown open amount remains unchanged",
			order:       repository.AppOrderRow{ProdukSKUSnapshot: "XYZ", ProdukNamaSnapshot: "Produk Bebas Nominal", Dest: "08571187308", Qty: 25000, HargaDasar: 26000},
			wantProduct: "XYZ", wantQty: 25000, wantDest: "08571187308",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := resolvePulsa24JamAppRequest(tt.order.ProdukSKUSnapshot, &tt.order)
			if got.Product != tt.wantProduct || got.Qty != tt.wantQty || got.Dest != tt.wantDest {
				t.Fatalf("got product=%s qty=%d dest=%s, want product=%s qty=%d dest=%s", got.Product, got.Qty, got.Dest, tt.wantProduct, tt.wantQty, tt.wantDest)
			}
		})
	}
}

func TestPulsa24JamFixedPulsaShouldOmitQty(t *testing.T) {
	if !pulsa24JamFixedPulsaShouldOmitQty(1, &repository.AppOrderRow{
		ProdukNamaSnapshot: "INDOSAT TRANSFER PULSA 5500",
		Nominal:            5500,
	}) {
		t.Fatal("fixed pulsa should omit qty for Pulsa24Jam")
	}
	if pulsa24JamFixedPulsaShouldOmitQty(100000, &repository.AppOrderRow{
		ProdukNamaSnapshot: "E-WALLET 2.500 GOPAY OPEN AMOUNT",
		Nominal:            100000,
	}) {
		t.Fatal("open amount wallet must keep qty")
	}
}
