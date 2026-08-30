# NuansaPulsa

NuansaPulsa adalah aplikasi terpisah yang menggunakan fondasi PulsaKilat.
Frontend dan backend berada dalam satu folder proyek, tetapi konfigurasi,
database, domain, rekening, serta kredensial provider wajib dibuat khusus
untuk NuansaPulsa.

## Struktur

- `nuansapulsa-fe`: aplikasi Next.js
- `nuansapulsa-be`: API Go dan migrasi database

## Menyiapkan konfigurasi

1. Salin `nuansapulsa-fe/.env-example` menjadi `.env.local`.
2. Salin `nuansapulsa-be/.env.example` menjadi `.env`.
3. Gunakan database baru; jangan arahkan `DATABASE_URL` ke database PulsaKilat.
4. Isi rekening deposit melalui variabel `NUANSAPULSA_DEPOSIT_*`.
5. Gunakan API key, webhook, OAuth, dan domain khusus NuansaPulsa.

File environment dan hasil build tidak disertakan dari proyek sumber.
