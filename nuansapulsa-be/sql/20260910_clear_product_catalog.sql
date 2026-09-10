BEGIN;

CREATE TABLE IF NOT EXISTS public.app_runtime_flag (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DELETE FROM public.member_fee_produk;
DELETE FROM public.produk_fee_provider;
DELETE FROM public.produk_provider_map;
DELETE FROM public.produk_app_pricing;
DELETE FROM public.kategori_fee_app;
DELETE FROM public.yuscom_produk_snapshot;

UPDATE public.produk
SET aktif = false,
    kategori_id = NULL,
    brand_id = NULL,
    diubah_pada = now();

DELETE FROM public.produk p
WHERE NOT EXISTS (
  SELECT 1 FROM public.app_order o WHERE o.produk_id = p.id
)
AND NOT EXISTS (
  SELECT 1 FROM public.app_billing_check b WHERE b.produk_id = p.id
);

DELETE FROM public.brand;
DELETE FROM public.kategori;

INSERT INTO public.app_runtime_flag (key, value, updated_at)
VALUES ('product_catalog_cleared', 'true', now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

COMMIT;
