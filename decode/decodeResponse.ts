import { FuncDecodeResponse } from "../types"
import { decodeIds } from "./decodeIds"
import { decodeMeta } from "./decodeMeta"
import { decodeObjects } from "./decodeObjects"
import { skipChars } from "./skipChars"

export const decodeResponse: FuncDecodeResponse = (tyson, ok = {}) => {
  tyson = skipChars(tyson)
  switch (true) {
    case tyson.startsWith("s|data|"): {
      tyson = skipChars(skipChars(tyson.slice(7)))
      if (tyson.startsWith(":")) {
        tyson = skipChars(skipChars(tyson.slice(1)))
      } else {
        throw new Error(
          `Unable to Parse TySON. Expected ':' after s|data|, but found ${tyson.slice(
            0,
            20
          )}}`
        )
      }
      if (tyson.startsWith("ids[")) {
        var [rTyson, ids] = decodeIds(tyson)
        ok.ids = ids
        tyson = rTyson
      } else {
        var [rTyson, data] = decodeObjects(tyson)
        ok.data = data
        tyson = skipChars(rTyson)
      }
      if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
      if (tyson.startsWith("}")) return [skipChars(tyson.slice(1)), { ok }]
      return decodeResponse(skipChars(tyson), ok)
    }
    case tyson.startsWith("s|meta|"): {
      tyson = skipChars(tyson.slice(7))
      if (tyson.startsWith(":")) {
        tyson = skipChars(tyson.slice(1))
      } else {
        throw new Error(
          `Unable to Parse TySON. Expected ':' after s|meta|, but found ${tyson.slice(
            0,
            20
          )}}`
        )
      }
      var [rTyson, meta] = decodeMeta(tyson)
      rTyson = skipChars(rTyson)
      ok.meta = meta
      if (rTyson.startsWith(",")) rTyson = skipChars(rTyson.slice(1))
      if (rTyson.startsWith("}")) return [skipChars(rTyson.slice(1)), { ok }]
      return decodeResponse(skipChars(rTyson), ok)
    }
    default:
      throw new Error(
        `Unable to Parse TySON. Expected either 's|data|:' or 's|meta|:', but found ${tyson.slice(
          0,
          20
        )}}`
      )
  }
}
