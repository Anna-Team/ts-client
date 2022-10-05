import { FuncDecodeID, FuncDecodeIDs } from "../types"
import { decodeString } from "./decodeString"
import { skipChars } from "./skipChars"

export const decodeID: FuncDecodeID = (tyson: string) => {
  var [rTyson, type] = decodeString(tyson)
  if (type.length < 1)
    throw new Error(
      `Unable to Parse TySON. Expected Collection to not be null, but found: ${rTyson.slice(
        0,
        20
      )}}`
    )
  var [r2Tyson, id] = decodeString(rTyson)
  if (id.length < 1)
    throw new Error(
      `Unable to Parse TySON. Expected ID to not be null, but found: ${r2Tyson.slice(
        0,
        20
      )}}`
    )
  return [skipChars(r2Tyson), { id, type }]
}

export const decodeIds: FuncDecodeIDs = (tyson, ids = []) => {
  if (!tyson.startsWith("ids["))
    throw new Error(
      `Unable to Parse TySON. Expected ID List 'ids[', but found ${tyson.slice(
        0,
        20
      )}}`
    )
  tyson = skipChars(tyson.slice(4))
  while (!tyson.startsWith("]")) {
    var [rTyson, id] = decodeID(tyson)
    ids.push(id)
    tyson = skipChars(rTyson)
    if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
  }
  if (!tyson.startsWith("]"))
    throw new Error(
      `Unable to Parse TySON. Expected ']', but found ${tyson.slice(0, 20)}}`
    )
  return [skipChars(tyson.slice(1)), ids]
}
