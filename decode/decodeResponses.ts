import { FuncDecodeResponses } from "../types"
import { decodeResponse } from "./decodeResponse"
import { skipChars } from "./skipChars"

export const decodeResponses: FuncDecodeResponses = (tyson) => {
  tyson = skipChars(tyson)
  if (tyson.startsWith("response{")) {
    tyson = skipChars(tyson.slice(9))
  } else {
    throw new Error(
      `Unable to Parse TySON. Expected 'response{', but found ${tyson.slice(
        0,
        20
      )}}`
    )
  }
  return decodeResponse(tyson)
}
