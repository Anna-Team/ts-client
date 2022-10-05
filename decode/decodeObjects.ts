import { FuncDecodeObjects } from "../types"
import { decodeItemSet } from "./decodeItemSet"

export const decodeObjects: FuncDecodeObjects = (tyson) => {
  if (tyson.startsWith("objects{")) tyson = tyson.slice(8)
  var [rTyson, items] = decodeItemSet(tyson)
  return [rTyson, items]
}
