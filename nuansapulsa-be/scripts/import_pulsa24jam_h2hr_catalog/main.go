package main

import (
	"bufio"
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	_ "github.com/lib/pq"

	"nuansapulsa/internal/repository"
)

var priceRE = regexp.MustCompile(`(?i)(?:\+\s*)?rp\s*([0-9.\s]+)`)

func main() {
	filePath := flag.String("file", "", "path file hasil copy/paste Produk H2HR Pulsa24Jam")
	dsn := flag.String("dsn", strings.TrimSpace(os.Getenv("DATABASE_URL")), "PostgreSQL DSN; default DATABASE_URL")
	dryRun := flag.Bool("dry-run", false, "parse saja tanpa tulis database")
	flag.Parse()

	if strings.TrimSpace(*filePath) == "" {
		log.Fatal("-file wajib diisi")
	}

	items, err := ParsePulsa24JamH2HRCatalogFile(*filePath)
	if err != nil {
		log.Fatal(err)
	}
	if *dryRun {
		fmt.Printf("parsed=%d\n", len(items))
		return
	}
	if strings.TrimSpace(*dsn) == "" {
		log.Fatal("DATABASE_URL kosong; isi env atau pakai -dsn")
	}

	db, err := sql.Open("postgres", *dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Minute)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Fatal(err)
	}
	result, err := repository.NewPulsa24JamCatalogRepository(db).Sync(ctx, items)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("synced=%d\n", result.Synced)
}

func ParsePulsa24JamH2HRCatalogFile(path string) ([]repository.Pulsa24JamCatalogItem, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	lines := make([]string, 0, 8192)
	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 1024), 1024*1024)
	for scanner.Scan() {
		line := cleanCatalogLine(scanner.Text())
		if line != "" {
			lines = append(lines, line)
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	return ParsePulsa24JamH2HRCatalogLines(lines), nil
}

func ParsePulsa24JamH2HRCatalogLines(lines []string) []repository.Pulsa24JamCatalogItem {
	headerIndexes := make([]int, 0, 256)
	for i := 2; i < len(lines); i++ {
		if lines[i] == "Harga" && lines[i-1] == "Keterangan" && lines[i-2] == "SKU" {
			headerIndexes = append(headerIndexes, i-2)
		}
	}

	items := make([]repository.Pulsa24JamCatalogItem, 0, len(headerIndexes)*8)
	currentCategory := "Lainnya"
	seen := map[string]struct{}{}

	for idx, header := range headerIndexes {
		if header < 1 {
			continue
		}
		brand := lines[header-1]
		if header >= 2 {
			candidate := lines[header-2]
			if isCategoryCandidate(candidate) {
				currentCategory = candidate
			}
		}
		end := len(lines)
		if idx+1 < len(headerIndexes) {
			end = headerIndexes[idx+1]
		}
		for i := header + 3; i+4 < end; i += 5 {
			sku := strings.ToUpper(strings.TrimSpace(lines[i]))
			name := strings.TrimSpace(lines[i+1])
			groupName := strings.TrimSpace(lines[i+2])
			priceType := strings.ToUpper(strings.TrimSpace(lines[i+3]))
			price := parseCatalogPrice(lines[i+4])
			if sku == "" || name == "" {
				continue
			}
			if priceType != "OPEN_AMOUNT" {
				priceType = "FIXED"
			}
			var maxNominal *int64
			if priceType == "OPEN_AMOUNT" {
				if max := parseMaxNominal(name); max > 0 {
					maxNominal = &max
				}
			}
			if _, ok := seen[sku]; ok {
				continue
			}
			seen[sku] = struct{}{}
			items = append(items, repository.Pulsa24JamCatalogItem{
				SKU:            sku,
				Name:           name,
				GroupName:      groupName,
				CategoryName:   currentCategory,
				BrandName:      brand,
				PriceType:      priceType,
				Price:          price,
				MaximumNominal: maxNominal,
			})
		}
	}
	return items
}

func cleanCatalogLine(line string) string {
	line = strings.TrimSpace(strings.ReplaceAll(line, "\u00a0", " "))
	line = strings.Join(strings.Fields(line), " ")
	return line
}

func isCategoryCandidate(value string) bool {
	value = strings.TrimSpace(value)
	if value == "" {
		return false
	}
	upper := strings.ToUpper(value)
	if upper == "SKU" || upper == "KETERANGAN" || upper == "HARGA" || upper == "FIXED" || upper == "OPEN_AMOUNT" || upper == "PULSA" || upper == "PPOB" || upper == "-" || upper == "BEBAS NOMINAL" {
		return false
	}
	if priceRE.MatchString(value) {
		return false
	}
	return true
}

func parseCatalogPrice(value string) int64 {
	match := priceRE.FindStringSubmatch(value)
	if len(match) < 2 {
		return 0
	}
	digits := onlyDigits(match[1])
	if digits == "" {
		return 0
	}
	n, _ := strconv.ParseInt(digits, 10, 64)
	return n
}

func parseMaxNominal(name string) int64 {
	upper := strings.ToUpper(name)
	if !strings.Contains(upper, "MAKS") && !strings.Contains(upper, "MAX") {
		return 0
	}
	matches := regexp.MustCompile(`\d{1,3}(?:[.\s]\d{3})+|\d{6,}`).FindAllString(name, -1)
	var max int64
	for _, raw := range matches {
		n, _ := strconv.ParseInt(onlyDigits(raw), 10, 64)
		if n > max {
			max = n
		}
	}
	return max
}

func onlyDigits(value string) string {
	var b strings.Builder
	for _, r := range value {
		if r >= '0' && r <= '9' {
			b.WriteRune(r)
		}
	}
	return b.String()
}
