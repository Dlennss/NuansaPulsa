package apporderpaymentdto

import commondto "nuansapulsa/internal/dto/common"

func MapError(msg string) ErrorResponse {
	return commondto.MapError(msg)
}

func MapItem(item any) ItemResponse {
	return commondto.MapItem(item)
}
