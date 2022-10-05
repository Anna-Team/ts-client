import { FuncDecodeResult, Result } from "../types"
import { decodeError } from "./decodeError"
import { decodeResponses } from "./decodeResponses"
import { skipChars } from "./skipChars"

export const decodeResult: FuncDecodeResult = (tyson) => {
  tyson = skipChars(tyson)
  switch (true) {
    case tyson.startsWith("ok["): {
      var [rTyson, results] = decodeResponses(tyson.slice(3))
      rTyson = skipChars(rTyson)
      if (rTyson.startsWith("]"))
        return [skipChars(rTyson.slice(1)), results as Result]
      throw new Error(
        `Unable to Parse TySON. Expected ok result set to end with ']', but found ${rTyson.slice(
          0,
          20
        )}}`
      )
    }
    case tyson.startsWith("error|"):
      return decodeError(tyson.slice(6))
    default:
      throw new Error(
        `Unable to Parse TySON. Expected Result, but found ${tyson.slice(
          0,
          20
        )}}`
      )
  }
}
