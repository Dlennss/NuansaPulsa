package service

import (
	"strings"
	"testing"
)

func TestAppProviderRefIDsFitPulsa24JamLimit(t *testing.T) {
	tests := []struct {
		name   string
		refID  string
		prefix string
	}{
		{name: "app order invoice", refID: buildAppOrderInvoiceID(), prefix: "NP"},
		{name: "billing check", refID: buildAppBillingCheckRefID(), prefix: "BC"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if len(tt.refID) > 20 {
				t.Fatalf("refid %q length=%d, want <= 20", tt.refID, len(tt.refID))
			}
			if len(tt.refID) != 20 {
				t.Fatalf("refid %q length=%d, want 20", tt.refID, len(tt.refID))
			}
			if !strings.HasPrefix(tt.refID, tt.prefix) {
				t.Fatalf("refid %q prefix mismatch, want %s", tt.refID, tt.prefix)
			}
		})
	}
}
