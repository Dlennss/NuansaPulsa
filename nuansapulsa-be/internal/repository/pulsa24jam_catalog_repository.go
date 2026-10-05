package repository

import (
	"context"
	"database/sql"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type Pulsa24JamCatalogItem struct {
	SKU            string
	Name           string
	GroupName      string
	CategoryName   string
	BrandName      string
	PriceType      string
	Nominal        *int64
	Price          int64
	MaximumNominal *int64
}

type Pulsa24JamCatalogSyncResult struct {
	Synced int
}

type Pulsa24JamCatalogRepository struct {
	db *sql.DB
}

func NewPulsa24JamCatalogRepository(db *sql.DB) *Pulsa24JamCatalogRepository {
	return &Pulsa24JamCatalogRepository{db: db}
}

func (r *Pulsa24JamCatalogRepository) Sync(ctx context.Context, items []Pulsa24JamCatalogItem) (*Pulsa24JamCatalogSyncResult, error) {
	if r == nil || r.db == nil {
		return nil, fmt.Errorf("repository katalog Pulsa24Jam belum siap")
	}
	if len(items) == 0 {
		return nil, fmt.Errorf("katalog Pulsa24Jam kosong; sinkronisasi dibatalkan")
	}
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if _, err := tx.ExecContext(ctx, `
INSERT INTO public.provider (nama, aktif, dibuat_pada, diubah_pada)
VALUES ('Pulsa24Jam', true, now(), now())
ON CONFLICT (nama) DO UPDATE SET aktif = true, diubah_pada = now()
`); err != nil {
		return nil, err
	}
	if _, err := tx.ExecContext(ctx, `
CREATE TABLE IF NOT EXISTS public.app_runtime_flag (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
`); err != nil {
		return nil, err
	}
	if _, err := tx.ExecContext(ctx, `DELETE FROM public.app_runtime_flag WHERE key = 'product_catalog_cleared'`); err != nil {
		return nil, err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE public.produk SET aktif = false, diubah_pada = now()`); err != nil {
		return nil, err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE public.produk_app_pricing SET aktif = false, updated_at = now()`); err != nil {
		return nil, err
	}
	if _, err := tx.ExecContext(ctx, `UPDATE public.produk_provider_map SET aktif = false, diubah_pada = now()`); err != nil {
		return nil, err
	}

	synced := 0
	for _, raw := range items {
		item := normalizePulsa24JamCatalogItem(raw)
		if item.SKU == "" || item.Name == "" {
			continue
		}
		categoryID, err := ensureCatalogMaster(ctx, tx, "kategori", item.CategoryName)
		if err != nil {
			return nil, err
		}
		brandID, err := ensureCatalogMaster(ctx, tx, "brand", item.BrandName)
		if err != nil {
			return nil, err
		}
		if _, err := tx.ExecContext(ctx, `
INSERT INTO public.kategori_fee_app
  (kategori_id, fee_master, fee_agent, fee_user, fee_non_user, aktif, created_at, updated_at)
VALUES ($1,0,0,0,0,true,now(),now())
ON CONFLICT (kategori_id) DO NOTHING
`, categoryID); err != nil {
			return nil, err
		}

		var productID int64
		err = tx.QueryRowContext(ctx, `
INSERT INTO public.produk
  (sku, nama, group_name, kategori_id, brand_id, tipe_harga, nominal, maksimal_nominal, jam_buka, jam_tutup, aktif, dibuat_pada, diubah_pada)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'00:00','23:59',true,now(),now())
ON CONFLICT (sku) DO UPDATE SET
  nama = EXCLUDED.nama,
  group_name = EXCLUDED.group_name,
  kategori_id = EXCLUDED.kategori_id,
  brand_id = EXCLUDED.brand_id,
  tipe_harga = EXCLUDED.tipe_harga,
  nominal = EXCLUDED.nominal,
  maksimal_nominal = EXCLUDED.maksimal_nominal,
  aktif = true,
  diubah_pada = now()
RETURNING id
`, item.SKU, item.Name, item.GroupName, categoryID, brandID, item.PriceType, item.Nominal, item.MaximumNominal).Scan(&productID)
		if err != nil {
			return nil, err
		}

		appActive := !pulsa24JamProductHiddenFromApp(item)
		var catalogActive bool
		if err := tx.QueryRowContext(ctx, `
INSERT INTO public.produk_app_pricing
  (produk_id, provider, harga, harga_dasar, yuscom_group, yuscom_category, yuscom_sku, yuscom_name, yuscom_status, yuscom_display_brand, aktif, fetched_at, created_at, updated_at, dibuat_pada, diubah_pada)
VALUES ($1,'Pulsa24Jam',$2,$2,$3,$4,$5,$6,$8,$7,$9,now(),now(),now(),now(),now())
ON CONFLICT (produk_id) DO UPDATE SET
  provider = 'Pulsa24Jam',
  harga = EXCLUDED.harga,
  harga_dasar = EXCLUDED.harga_dasar,
  yuscom_group = EXCLUDED.yuscom_group,
  yuscom_category = EXCLUDED.yuscom_category,
  yuscom_sku = EXCLUDED.yuscom_sku,
  yuscom_name = EXCLUDED.yuscom_name,
  yuscom_status = EXCLUDED.yuscom_status,
  yuscom_display_brand = EXCLUDED.yuscom_display_brand,
  aktif = EXCLUDED.aktif,
  fetched_at = now(),
  updated_at = now(),
  diubah_pada = now()
RETURNING aktif
`, productID, item.Price, item.GroupName, item.CategoryName, item.SKU, item.Name, item.BrandName, pulsa24JamAppStatus(appActive), appActive).Scan(&catalogActive); err != nil {
			return nil, err
		}

		var minimumNominal any
		if item.PriceType == "OPEN_AMOUNT" {
			minimumNominal = int64(1)
		}
		if _, err := tx.ExecContext(ctx, `
INSERT INTO public.produk_provider_map
  (produk_id, provider, kode_provider, mode, aktif, prioritas, minimal_nominal, maksimal_nominal, fee_rp, dibuat_pada, diubah_pada)
VALUES ($1,'Pulsa24Jam',$2,'normal',$5,1,$3,$4,0,now(),now())
ON CONFLICT (produk_id, provider, kode_provider) DO UPDATE SET
  mode = 'normal', aktif = EXCLUDED.aktif, prioritas = 1,
  minimal_nominal = EXCLUDED.minimal_nominal,
  maksimal_nominal = EXCLUDED.maksimal_nominal,
  fee_rp = 0, diubah_pada = now()
`, productID, item.SKU, minimumNominal, item.MaximumNominal, catalogActive); err != nil {
			return nil, err
		}
		synced++
	}
	if synced == 0 {
		return nil, fmt.Errorf("tidak ada produk Pulsa24Jam valid; sinkronisasi dibatalkan")
	}
	if _, err := tx.ExecContext(ctx, `
UPDATE public.kategori k
SET aktif = EXISTS (
  SELECT 1 FROM public.produk p
  WHERE p.kategori_id = k.id
    AND p.aktif = true
), diubah_pada = now()
`); err != nil {
		return nil, err
	}
	if _, err := tx.ExecContext(ctx, `
UPDATE public.brand b
SET aktif = EXISTS (
  SELECT 1 FROM public.produk p
  WHERE p.brand_id = b.id
    AND p.aktif = true
), diubah_pada = now()
`); err != nil {
		return nil, err
	}
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return &Pulsa24JamCatalogSyncResult{Synced: synced}, nil
}

func normalizePulsa24JamCatalogItem(item Pulsa24JamCatalogItem) Pulsa24JamCatalogItem {
	item.SKU = strings.ToUpper(strings.TrimSpace(item.SKU))
	item.Name = strings.TrimSpace(item.Name)
	item.GroupName = strings.TrimSpace(item.GroupName)
	item.CategoryName = strings.TrimSpace(item.CategoryName)
	item.BrandName = strings.TrimSpace(item.BrandName)
	item.PriceType = strings.ToUpper(strings.TrimSpace(item.PriceType))
	if item.GroupName == "" {
		item.GroupName = "Pulsa24Jam"
	}
	if item.CategoryName == "" {
		item.CategoryName = "Lainnya"
	}
	if item.BrandName == "" {
		item.BrandName = "Pulsa24Jam"
	}
	if item.PriceType != "OPEN_AMOUNT" {
		item.PriceType = "FIXED"
	}
	if item.PriceType == "FIXED" && item.Nominal == nil {
		if nominal := parsePulsa24JamFixedNominal(item.SKU, item.Name); nominal > 0 {
			item.Nominal = &nominal
		}
	}
	return item
}

var pulsa24JamNominalPattern = regexp.MustCompile(`\d{1,3}(?:[.\s]\d{3})+|\d{4,}`)

func parsePulsa24JamFixedNominal(sku, name string) int64 {
	upperName := strings.ToUpper(strings.TrimSpace(name))
	if !pulsa24JamFixedNameUsuallyCarriesNominal(upperName) {
		return 0
	}
	matches := pulsa24JamNominalPattern.FindAllString(upperName, -1)
	if len(matches) > 0 {
		n, _ := strconv.ParseInt(onlyDigitsString(matches[len(matches)-1]), 10, 64)
		if n >= 1000 {
			return n
		}
	}

	match := regexp.MustCompile(`([0-9]+)$`).FindStringSubmatch(strings.ToUpper(strings.TrimSpace(sku)))
	if len(match) != 2 {
		return 0
	}
	n, _ := strconv.ParseInt(match[1], 10, 64)
	if n <= 0 {
		return 0
	}
	if n < 1000 {
		n *= 1000
	}
	return n
}

func pulsa24JamFixedNameUsuallyCarriesNominal(upperName string) bool {
	return strings.Contains(upperName, "PULSA") ||
		strings.Contains(upperName, "SALDO") ||
		strings.Contains(upperName, "E-WALLET") ||
		strings.Contains(upperName, "TRANSFER") ||
		strings.Contains(upperName, "VOUCHER")
}

func onlyDigitsString(value string) string {
	var b strings.Builder
	for _, r := range value {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}
	return b.String()
}

func pulsa24JamProductHiddenFromApp(item Pulsa24JamCatalogItem) bool {
	if item.PriceType != "FIXED" {
		return false
	}
	name := strings.ToUpper(strings.TrimSpace(item.Name))
	group := strings.ToUpper(strings.TrimSpace(item.GroupName))
	category := strings.ToUpper(strings.TrimSpace(item.CategoryName))
	return strings.Contains(name, "TRANSFER PULSA") &&
		(strings.Contains(name, "PULSA") || strings.Contains(group, "PULSA") || strings.Contains(category, "PULSA"))
}

func pulsa24JamAppStatus(active bool) string {
	if active {
		return "ACTIVE"
	}
	return "HIDDEN_TRANSFER_PULSA"
}

func ensureCatalogMaster(ctx context.Context, tx *sql.Tx, table, name string) (int64, error) {
	if table != "kategori" && table != "brand" {
		return 0, fmt.Errorf("master katalog tidak valid")
	}
	var id int64
	query := fmt.Sprintf(`SELECT id FROM public.%s WHERE LOWER(TRIM(nama)) = LOWER(TRIM($1)) ORDER BY id LIMIT 1`, table)
	err := tx.QueryRowContext(ctx, query, name).Scan(&id)
	if err == nil {
		_, err = tx.ExecContext(ctx, fmt.Sprintf(`UPDATE public.%s SET aktif = true, diubah_pada = now() WHERE id = $1`, table), id)
		return id, err
	}
	if err != sql.ErrNoRows {
		return 0, err
	}
	insert := fmt.Sprintf(`INSERT INTO public.%s (nama, aktif, dibuat_pada, diubah_pada) VALUES ($1,true,now(),now()) RETURNING id`, table)
	if err := tx.QueryRowContext(ctx, insert, name).Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}
