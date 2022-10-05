import { FuncDecodeMeta } from "../types"
import { decodeMap } from "./decodeMap"
import { skipChars } from "./skipChars"

export const decodeMeta: FuncDecodeMeta = (tyson) => {
  tyson = skipChars(tyson)
  switch (true) {
    case tyson.startsWith("get_meta{"):
      return decodeMap(tyson.slice(9), false)
    case tyson.startsWith("find_meta{"):
      return decodeMap(tyson.slice(10), false)
    case tyson.startsWith("insert_meta{"):
    case tyson.startsWith("update_meta{"):
    case tyson.startsWith("delete_meta{"):
      return decodeMap(tyson.slice(12), false)
    default:
      throw new Error(
        `Unable to parse TySON. Expected meta data, but found: ${tyson.slice(
          0,
          20
        )}`
      )
  }
}
