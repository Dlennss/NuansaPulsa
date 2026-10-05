package main

import "testing"

func TestParsePulsa24JamH2HRCatalogLines(t *testing.T) {
	items := ParsePulsa24JamH2HRCatalogLines([]string{
		"Bank Transfer",
		"BCA",
		"SKU",
		"Keterangan",
		"Harga",
		"BCA",
		"Transfer Bank BCA",
		"-",
		"OPEN_AMOUNT",
		"+ Rp 0",
		"BPJS",
		"BPJS Kesehatan",
		"SKU",
		"Keterangan",
		"Harga",
		"BPJS",
		"BPJS KESEHATAN",
		"PPOB",
		"FIXED",
		"Rp 1.600",
		"BPJS2500",
		"BPJS KESEHATAN (1BLN) ADM2500",
		"PPOB",
		"FIXED",
		"Rp 1.600",
		"Indosat",
		"SKU",
		"Keterangan",
		"Harga",
		"YIT55",
		"INDOSAT TRANSFER PULSA 5500",
		"PULSA",
		"FIXED",
		"Rp 7.200",
	})
	if len(items) != 4 {
		t.Fatalf("len(items)=%d, want 4", len(items))
	}
	if items[0].SKU != "BCA" || items[0].CategoryName != "Bank Transfer" || items[0].BrandName != "BCA" || items[0].PriceType != "OPEN_AMOUNT" {
		t.Fatalf("unexpected first item: %+v", items[0])
	}
	if items[1].SKU != "BPJS" || items[1].CategoryName != "BPJS" || items[1].BrandName != "BPJS Kesehatan" || items[1].Price != 1600 {
		t.Fatalf("unexpected second item: %+v", items[1])
	}
	if items[3].SKU != "YIT55" || items[3].Nominal == nil || *items[3].Nominal != 5500 || items[3].Price != 7200 {
		t.Fatalf("unexpected fixed pulsa item: %+v", items[3])
	}
}
