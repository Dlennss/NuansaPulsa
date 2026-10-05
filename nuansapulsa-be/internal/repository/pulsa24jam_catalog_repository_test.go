package repository

import "testing"

func TestPulsa24JamProductHiddenFromApp(t *testing.T) {
	tests := []struct {
		name string
		item Pulsa24JamCatalogItem
		want bool
	}{
		{
			name: "transfer pulsa hidden",
			item: Pulsa24JamCatalogItem{
				SKU:          "ITP5",
				Name:         "INDOSAT TRANSFER PULSA 5.000",
				GroupName:    "PULSA",
				CategoryName: "Pulsa",
				PriceType:    "FIXED",
			},
			want: true,
		},
		{
			name: "regular h2h pulsa stays visible",
			item: Pulsa24JamCatalogItem{
				SKU:          "IH5",
				Name:         "INDOSAT PULSA H2H 5.000",
				GroupName:    "PULSA",
				CategoryName: "Pulsa",
				PriceType:    "FIXED",
			},
			want: false,
		},
		{
			name: "open amount product stays visible",
			item: Pulsa24JamCatalogItem{
				SKU:          "GOPAY",
				Name:         "E-WALLET 2.500 GOPAY OPEN AMOUNT",
				GroupName:    "E-Wallet",
				CategoryName: "E-Money",
				PriceType:    "OPEN_AMOUNT",
			},
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := pulsa24JamProductHiddenFromApp(normalizePulsa24JamCatalogItem(tt.item))
			if got != tt.want {
				t.Fatalf("pulsa24JamProductHiddenFromApp() = %v, want %v", got, tt.want)
			}
		})
	}
}
