import { FuncDecodeVector } from "../types"
import { decodeScalar } from "./decodeScalar"
import { skipChars } from "./skipChars"

export const decodeVector: FuncDecodeVector = (
  tyson,
  allowItemRef,
  vector = []
) => {
  tyson = skipChars(tyson)
  if (tyson.startsWith("]")) {
    return [skipChars(tyson.slice(1)), vector]
  }
  var [rTyson, scalar] = decodeScalar(tyson, allowItemRef)
  if (rTyson.startsWith(",")) rTyson = skipChars(rTyson.slice(1))
  return decodeVector(rTyson, allowItemRef, [...vector, scalar])
}
