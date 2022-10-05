import { FuncDecodeScalar } from "../types"
import { decodeBool } from "./decodeBool"
import { decodeDate } from "./decodeDate"
import { decodeMap } from "./decodeMap"
import { decodeNumber } from "./decodeNumber"
import { decodeString } from "./decodeString"
import { decodeVector } from "./decodeVector"
import { skipChars } from "./skipChars"

export const decodeScalar: FuncDecodeScalar = (tyson, allowItemRef = false) => {
  tyson = skipChars(tyson)
  if (tyson.startsWith(",")) tyson = tyson.slice(1)
  tyson = skipChars(tyson)
  switch (true) {
    case tyson.startsWith("s|"):
      return decodeString(tyson.slice(2))
    case tyson.startsWith("n|"):
      return decodeNumber(tyson.slice(2))
    case tyson.startsWith("b|"):
      return decodeBool(tyson.slice(2))
    case tyson.startsWith("uts|"):
      return decodeDate(tyson.slice(4))
    case tyson.startsWith("m{"):
      return decodeMap(tyson.slice(2), allowItemRef)
    case tyson.startsWith("v["):
      return decodeVector(tyson.slice(2), allowItemRef)
    case new RegExp(/^null[\|\]\}\,]/).test(tyson):
      return [tyson.slice(4), null]
    case new RegExp(/^/).test(tyson):
    // return decodeItemRef(tyson)
    default:
      throw new Error(
        `Unable to Parse TySON. Expected Scalar, but found: ${tyson.slice(
          0,
          20
        )}`
      )
  }
}
