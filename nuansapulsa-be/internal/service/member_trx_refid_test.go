package service

import (
	"strings"
	"testing"
)

func TestValidatePulsa24JamRefIDLength(t *testing.T) {
	if err := validatePulsa24JamRefIDLength("PAY", strings.Repeat("A", pulsa24JamRefIDMaxLength)); err != nil {
		t.Fatalf("20-char refid should pass, got %v", err)
	}
	if err := validatePulsa24JamRefIDLength("PAY", strings.Repeat("A", pulsa24JamRefIDMaxLength+1)); err == nil {
		t.Fatal("21-char PAY refid should be rejected")
	}
	if err := validatePulsa24JamRefIDLength("PRODUK", strings.Repeat("A", pulsa24JamRefIDMaxLength+20)); err != nil {
		t.Fatalf("PRODUK does not send refid to provider and should pass, got %v", err)
	}
}
