import { FuncDecodeTyson } from '../types'
import { decodeQuery } from './decodeQuery'
import { decodeResult } from './decodeResult'
import { skipChars, ws } from './skipChars'

export const decodeTyson: FuncDecodeTyson = (tyson, decodedArray = []) => {
  tyson = skipChars(tyson)
  if (tyson.length < 1) throw new Error(`Unable to parse TySON: TySON is empty`)
  switch (true) {
    case tyson.startsWith('collection|'): {
      const res = decodeQuery(tyson.slice(11))
      let rTyson = res[0]
      const query = res[1]
      rTyson = skipChars(rTyson, [...ws, ';'])
      if (rTyson.length > 0) {
        return decodeTyson(rTyson, [...decodedArray, query])
      }
      if (decodedArray.length > 0) {
        return [rTyson, [...decodedArray, query]]
      }
      return [rTyson, query]
    }
    case tyson.startsWith('result'): {
      tyson = skipChars(tyson.slice(6))
      if (!tyson.startsWith(':')) {
        throw new Error(
          `Unable to Parse TySON. Expected colon (:) after result keyword, but found ${tyson.slice(
            0,
            20
          )}}`
        )
      }
      // eslint-disable-next-line prefer-const
      let [rTyson, result] = decodeResult(skipChars(tyson.slice(1)))
      rTyson = skipChars(rTyson, [...ws, ';'])
      if (rTyson.length > 0) {
        return decodeTyson(rTyson, [...decodedArray, result])
      }
      if (decodedArray.length > 0) {
        return [rTyson, [...decodedArray, result]]
      }
      return [rTyson, result]
    }
    default:
      throw new Error(
        `Unable to parse TySON. Expected Collection or Result, but found: ${tyson.slice(
          0,
          20
        )}`
      )
  }
}
