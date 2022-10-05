import { FuncDecodeError } from "../types"
import { decodeString } from "./decodeString"

export const decodeError: FuncDecodeError = (tyson) => {
  var [rTyson, error] = decodeString(tyson)
  if (rTyson.startsWith(";")) rTyson = rTyson.slice(1)
  return [rTyson, { error }]
}
