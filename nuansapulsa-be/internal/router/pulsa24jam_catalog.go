package router

import (
	"context"
	"database/sql"
	"log"
	"os"
	"strings"
	"time"

	"nuansapulsa/internal/provider"
	"nuansapulsa/internal/repository"
	"nuansapulsa/internal/service"
)

func startPulsa24JamCatalogSync(db *sql.DB, client *provider.Pulsa24JamAdapter) {
	if db == nil || client == nil || !client.Configured() {
		return
	}
	interval := 15 * time.Minute
	raw := strings.TrimSpace(os.Getenv("PULSA24JAM_PRODUCT_SYNC_INTERVAL"))
	if raw == "" {
		raw = strings.TrimSpace(os.Getenv("Pulsa24Jam_PRODUCT_SYNC_INTERVAL"))
	}
	if raw != "" {
		if parsed, err := time.ParseDuration(raw); err == nil && parsed >= time.Minute {
			interval = parsed
		} else {
			log.Printf("Pulsa24Jam product sync interval tidak valid: %q; memakai %s", raw, interval)
		}
	}
	syncService := service.NewPulsa24JamCatalogSyncService(repository.NewPulsa24JamCatalogRepository(db), client)
	run := func() {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
		defer cancel()
		result, err := syncService.Sync(ctx)
		if err != nil {
			log.Printf("Pulsa24Jam product sync gagal: %v", err)
			return
		}
		log.Printf("Pulsa24Jam product sync selesai: %d produk", result.Synced)
	}
	go func() {
		// Jangan menahan startup HTTP; validasi live tetap dilakukan sebelum order dibuat.
		run()
		ticker := time.NewTicker(interval)
		defer ticker.Stop()
		for range ticker.C {
			run()
		}
	}()
}
