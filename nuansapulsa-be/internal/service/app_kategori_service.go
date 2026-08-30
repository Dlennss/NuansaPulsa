package service

import (
	"context"

	"nuansapulsa/internal/repository"
)

type AppKategoriService struct {
	repo *repository.AppKategoriRepository
}

func NewAppKategoriService(repo *repository.AppKategoriRepository) *AppKategoriService {
	return &AppKategoriService{repo: repo}
}

func (s *AppKategoriService) List(ctx context.Context) ([]repository.MasterSimpleRow, error) {
	return s.repo.List(ctx)
}
