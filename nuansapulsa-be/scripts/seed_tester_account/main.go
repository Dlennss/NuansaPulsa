package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

const (
	defaultEmail    = "tester@nuansapulsa.com"
	defaultName     = "Akun Tester"
	defaultPassword = "Tester12345"
	defaultRole     = "user"
	defaultBalance  = int64(300_000)
)

func main() {
	log.SetFlags(0)
	_ = godotenv.Load(".env")

	dsn := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if dsn == "" {
		log.Fatal("DATABASE_URL is empty")
	}

	email := envOrDefault("TESTER_EMAIL", defaultEmail)
	name := envOrDefault("TESTER_NAME", defaultName)
	password := envOrDefault("TESTER_PASSWORD", defaultPassword)
	role := envOrDefault("TESTER_ROLE", defaultRole)
	balance := envInt64OrDefault("TESTER_BALANCE", defaultBalance)

	if len(password) < 8 {
		log.Fatal("TESTER_PASSWORD minimal 8 karakter")
	}
	if balance < 0 {
		log.Fatal("TESTER_BALANCE tidak boleh negatif")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("open database: %v", err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Fatalf("ping database: %v", err)
	}

	result, err := seedTester(ctx, db, email, name, password, role, balance)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf(
		"tester ready: email=%s password=%s member_id=%d role=%s saldo_sebelum=%d saldo_sesudah=%d delta=%d created=%t\n",
		result.Email,
		password,
		result.MemberID,
		result.Role,
		result.Before,
		result.After,
		result.Delta,
		result.Created,
	)
}

type seedResult struct {
	Email    string
	MemberID int64
	Role     string
	Before   int64
	After    int64
	Delta    int64
	Created  bool
}

func seedTester(ctx context.Context, db *sql.DB, email, name, password, role string, balance int64) (seedResult, error) {
	email = strings.TrimSpace(strings.ToLower(email))
	name = strings.TrimSpace(name)
	role = strings.TrimSpace(strings.ToLower(role))
	if role == "" {
		role = defaultRole
	}
	if email == "" {
		return seedResult{}, fmt.Errorf("TESTER_EMAIL kosong")
	}
	if role != "user" && role != "agent" && role != "master" && role != "marketing" {
		return seedResult{}, fmt.Errorf("TESTER_ROLE=%s tidak cocok untuk akun tester retail", role)
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return seedResult{}, err
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return seedResult{}, err
	}
	defer func() { _ = tx.Rollback() }()

	var (
		memberID int64
		dbRole   string
		created  bool
	)
	err = tx.QueryRowContext(ctx, `
SELECT id, COALESCE(role, '')
FROM public.member
WHERE lower(email) = lower($1)
LIMIT 1
`, email).Scan(&memberID, &dbRole)
	if err == sql.ErrNoRows {
		created = true
		err = tx.QueryRowContext(ctx, `
INSERT INTO public.member (email, nama, password_hash, role, aktif)
VALUES ($1, NULLIF($2, ''), $3, $4, true)
RETURNING id
`, email, name, string(passwordHash), role).Scan(&memberID)
		dbRole = role
	}
	if err != nil {
		return seedResult{}, err
	}

	if !created {
		if _, err = tx.ExecContext(ctx, `
UPDATE public.member
SET nama = COALESCE(NULLIF($2, ''), nama),
    password_hash = $3,
    role = $4,
    aktif = true,
    diubah_pada = now()
WHERE id = $1
`, memberID, name, string(passwordHash), role); err != nil {
			return seedResult{}, err
		}
		dbRole = role
	}

	if _, err = tx.ExecContext(ctx, `
INSERT INTO public.dompet_member (member_id, saldo)
VALUES ($1, 0)
ON CONFLICT (member_id) DO NOTHING
`, memberID); err != nil {
		return seedResult{}, err
	}

	var before int64
	if err = tx.QueryRowContext(ctx, `
SELECT saldo
FROM public.dompet_member
WHERE member_id = $1
FOR UPDATE
`, memberID).Scan(&before); err != nil {
		return seedResult{}, err
	}

	after := balance
	delta := after - before
	if _, err = tx.ExecContext(ctx, `
UPDATE public.dompet_member
SET saldo = $2, diperbarui_pada = now()
WHERE member_id = $1
`, memberID, after); err != nil {
		return seedResult{}, err
	}

	if delta != 0 {
		arah := "CREDIT"
		jumlah := delta
		if delta < 0 {
			arah = "DEBIT"
			jumlah = -delta
		}
		refID := "TESTER-BAL-" + time.Now().Format("20060102150405")
		if _, err = tx.ExecContext(ctx, `
INSERT INTO public.mutasi_dompet
  (member_id, ref_id, arah, jumlah, alasan, catatan, saldo_sebelum, saldo_sesudah, dibuat_pada)
VALUES
  ($1, $2, $3, $4, 'DUMMY_TEST_BALANCE', 'Saldo tester untuk uji pembelian produk', $5, $6, now())
`, memberID, refID, arah, jumlah, before, after); err != nil {
			return seedResult{}, err
		}
	}

	if err = tx.Commit(); err != nil {
		return seedResult{}, err
	}

	return seedResult{
		Email:    email,
		MemberID: memberID,
		Role:     dbRole,
		Before:   before,
		After:    after,
		Delta:    delta,
		Created:  created,
	}, nil
}

func envOrDefault(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func envInt64OrDefault(key string, fallback int64) int64 {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		log.Fatalf("%s invalid: %v", key, err)
	}
	return parsed
}
