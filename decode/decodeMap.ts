import { FuncDecodeMap } from "../types"
import { decodeScalar } from "./decodeScalar"
import { decodeString } from "./decodeString"
import { skipChars } from "./skipChars"

export const decodeMap: FuncDecodeMap = (tyson, allowItemRef, dmap = {}) => {
  tyson = skipChars(tyson)
  if (tyson.startsWith(",")) {
    if (Object.keys(dmap).length === 0)
      throw new Error(
        `Unable to parse TySON. Expected Map Key, but found comma: ${tyson.slice(
          0,
          20
        )}}`
      )
    tyson = skipChars(tyson.slice(1))
  }
  if (tyson.startsWith("}")) return [skipChars(tyson.slice(1)), dmap]
  if (!tyson.startsWith("s|"))
    throw new Error(
      `Unable to Parse TySON. Expected Map Key, but found: ${tyson.slice(
        0,
        20
      )}}`
    )
  var [rTyson, key] = decodeString(tyson.slice(2))
  rTyson = skipChars(rTyson)
  if (rTyson.startsWith(":")) {
    rTyson = skipChars(rTyson.slice(1))
  } else {
    throw new Error(
      `Unable to Parse TySON. Expected Map separator (:), but found: ${rTyson.slice(
        0,
        20
      )}}`
    )
  }
  if (key == "")
    throw new Error(
      `Unable to Parse TySON. Expected Map Key to not be empty, but found: ${tyson.slice(
        0,
        20
      )}}`
    )
  var [r2Tyson, scalar] = decodeScalar(rTyson, allowItemRef)
  dmap[key] = scalar
  return decodeMap(r2Tyson, allowItemRef, dmap)
}
