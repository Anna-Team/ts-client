import { FuncDecodeItemSet, Object } from "../types"
import { decodeCollectionID } from "./decodeCollectionID"
import { decodeScalar } from "./decodeScalar"
import { skipChars } from "./skipChars"

export const decodeItemSet: FuncDecodeItemSet = (tyson, items = []) => {
  tyson = skipChars(tyson)
  var [rTyson, colId] = decodeCollectionID(tyson)
  rTyson = skipChars(rTyson)
  if (rTyson.startsWith(":")) {
    rTyson = skipChars(rTyson.slice(1))
  } else {
    throw new Error(
      `Unable to Parse TySON. Expected Object Map separator (:), but found: ${rTyson.slice(
        0,
        20
      )}}`
    )
  }
  var [r2Tyson, scalar] = decodeScalar(rTyson, false)
  r2Tyson = skipChars(r2Tyson)
  const item: Object = {
    ...colId,
    _value: scalar,
  }
  items.push(item)
  if (r2Tyson.startsWith(",")) r2Tyson = skipChars(r2Tyson.slice(1))
  if (r2Tyson.startsWith("}")) return [skipChars(r2Tyson.slice(1)), items]
  return decodeItemSet(r2Tyson, items)
}
