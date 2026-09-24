BEGIN;

CREATE TABLE IF NOT EXISTS public.app_runtime_flag (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DELETE FROM public.app_runtime_flag
WHERE key = 'product_catalog_cleared';

INSERT INTO public.provider (nama, aktif, dibuat_pada, diubah_pada)
VALUES ('Pulsa24Jam', true, now(), now())
ON CONFLICT (nama) DO UPDATE SET aktif = true, diubah_pada = now();

UPDATE public.produk_provider_map
SET aktif = false,
    diubah_pada = now()
WHERE LOWER(TRIM(provider)) <> 'pulsa24jam';

UPDATE public.produk_app_pricing
SET aktif = false,
    updated_at = now(),
    diubah_pada = now()
WHERE LOWER(TRIM(provider)) <> 'pulsa24jam';

UPDATE public.produk p
SET aktif = EXISTS (
  SELECT 1
  FROM public.produk_provider_map ppm
  JOIN public.produk_app_pricing pap ON pap.produk_id = p.id
  WHERE ppm.produk_id = p.id
    AND LOWER(TRIM(ppm.provider)) = 'pulsa24jam'
    AND LOWER(TRIM(pap.provider)) = 'pulsa24jam'
    AND ppm.aktif = true
    AND pap.aktif = true
),
diubah_pada = now();

UPDATE public.kategori k
SET aktif = EXISTS (
  SELECT 1 FROM public.produk p
  WHERE p.kategori_id = k.id
    AND p.aktif = true
),
diubah_pada = now();

UPDATE public.brand b
SET aktif = EXISTS (
  SELECT 1 FROM public.produk p
  WHERE p.brand_id = b.id
    AND p.aktif = true
),
diubah_pada = now();

COMMIT;
