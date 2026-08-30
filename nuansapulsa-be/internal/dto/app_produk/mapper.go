package appprodukdto

import commondto "nuansapulsa/internal/dto/common"

func MapError(msg string) ErrorResponse {
	return commondto.MapError(msg)
}

func MapList(items any) ListResponse {
	return commondto.MapList(items)
}
