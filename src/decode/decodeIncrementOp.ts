import { FuncDecodeIncrementOp, IncOpPath, IncOpRoot, IncOps } from '../types'
import { decodeNumber } from './decodeNumber'
import { decodeString } from './decodeString'
import { skipChars } from './skipChars'

export const decodeIncrementOp: FuncDecodeIncrementOp = (
  tyson: string,
  increments = []
) => {
  if (tyson.startsWith('root')) {
    if (increments.length > 0)
      throw new Error(
        `Unable to parse Tyson. Only single root increment allowed, but found: ${tyson.slice(
          0,
          20
        )}`
      )
    tyson = skipChars(tyson.slice(4))
    if (!tyson.startsWith(':'))
      throw new Error(
        `Unable to parse TySON. Expected colon (:), but found ${tyson.slice(
          0,
          20
        )}`
      )
    tyson = skipChars(tyson.slice(1))
    if (!tyson.startsWith('n|'))
      throw new Error(
        `Unable to parse TySON. Expected number, but found ${tyson.slice(
          0,
          20
        )}`
      )
    tyson = skipChars(tyson.slice(2))
    const [rTyson, num] = decodeNumber(tyson)
    tyson = rTyson
    if (tyson.startsWith(',')) tyson = skipChars(tyson.slice(1))
    if (!tyson.startsWith('}'))
      throw new Error(
        `Unable to parse TySON. Expected root increment operation to only have root value, but found ${tyson.slice(
          0,
          20
        )}`
      )
    const inc: IncOpRoot = { root: num }
    return [skipChars(tyson), inc]
  } else if (tyson.startsWith('value|')) {
    tyson = skipChars(tyson.slice(6))
    const [rTyson, path] = decodeString(tyson)
    tyson = rTyson
    if (!tyson.startsWith(':'))
      throw new Error(
        `Unable to parse TySON. Expected colon (:), but found ${tyson.slice(
          0,
          20
        )}`
      )
    tyson = skipChars(tyson.slice(1))
    if (!tyson.startsWith('n|'))
      throw new Error(
        `Unable to parse TySON. Expected number, but found ${tyson.slice(
          0,
          20
        )}`
      )
    tyson = skipChars(tyson.slice(2))
    const [r2Tyson, num] = decodeNumber(tyson)
    tyson = r2Tyson
    const inc: IncOpPath = { path, by: num }
    if (tyson.startsWith(',')) {
      return decodeIncrementOp(skipChars(tyson.slice(1)), [...increments, inc])
    }
    if (increments.length > 0) {
      const incOps: IncOps = [...increments, inc] as unknown as IncOps
      return [skipChars(tyson), incOps]
    }
    return [skipChars(tyson), inc]
  }
  throw new Error(
    `Unable to parse Tyson. Expected "root" or "value|" map key, but found: ${tyson.slice(
      0,
      20
    )}`
  )
}
