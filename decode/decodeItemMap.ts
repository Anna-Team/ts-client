import { FuncDecodeItemMap } from "../types"
import { decodeCollectionID } from "./decodeCollectionID"
import { decodeScalar } from "./decodeScalar"

export const decodeItemMap: FuncDecodeItemMap = (tyson, items = {}) => {
  var [rTyson, colId] = decodeCollectionID(tyson)
  var id = colId._id
  var [r2Tyson, scalar] = decodeScalar(rTyson, false)
  items[id] = scalar
  if (r2Tyson.startsWith(",")) r2Tyson = r2Tyson.slice(1)
  if (r2Tyson.startsWith("}")) return [r2Tyson.slice(1), items]
  return decodeItemMap(r2Tyson, items)
}
