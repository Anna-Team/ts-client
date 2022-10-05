import { FuncDecodePathOrOp } from "../types"
import { decodeScalar } from "./decodeScalar"
import { decodeString } from "./decodeString"
import { skipChars } from "./skipChars"

export const decodePathOrRootOp: FuncDecodePathOrOp = (tyson) => {
  if (tyson.startsWith("root")) {
    tyson = skipChars(tyson.slice(4))
    if (tyson.startsWith(":")) {
      tyson = skipChars(tyson.slice(1))
      var [rTyson, op] = decodeScalar(tyson, false)
      return [rTyson, { root: op }]
    }
    throw new Error(
      `Unable to parse TySON. Expected a colon (:) after root keyword, but found: ${tyson.slice(
        0,
        20
      )}`
    )
  } else if (tyson.startsWith("value|")) {
    var [rTyson, path] = decodeString(tyson.slice(6))
    rTyson = skipChars(rTyson)
    if (rTyson.startsWith(":")) {
      rTyson = skipChars(rTyson.slice(1))
      var [rTyson, op] = decodeScalar(rTyson, false)
      return [rTyson, { path, value: op }]
    }
    throw new Error(
      `Unable to parse TySON. Expected a colon (:) after path, but found: ${tyson.slice(
        0,
        20
      )}`
    )
  }
  throw new Error(
    `Unable to parse TySON. Expected a path or root operation, but found: ${tyson.slice(
      0,
      20
    )}`
  )
}
