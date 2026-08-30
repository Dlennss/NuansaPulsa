package apporderrefunddto

import commondto "nuansapulsa/internal/dto/common"

func MapError(msg string) commondto.ErrorResponse {
	return commondto.MapError(msg)
}

func MapItem(item any) commondto.ItemResponse {
	return commondto.MapItem(item)
}
