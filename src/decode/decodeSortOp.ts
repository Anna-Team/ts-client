import { FuncDecodeSortOp, SortOp, SortOps } from '../types'
import { decodeString } from './decodeString'
import { skipChars } from './skipChars'

export const decodeSortOp: FuncDecodeSortOp = (tyson, sortOps = []) => {
  let sortDir: keyof SortOp = 'asc'
  if (tyson.startsWith('asc(')) {
    tyson = skipChars(tyson.slice(4))
  } else if (tyson.startsWith('desc(')) {
    sortDir = 'desc'
    tyson = skipChars(tyson.slice(5))
  } else {
    throw new Error(
      `Unable to parse TySON. Expected "asc" or "desc", but found: ${tyson.slice(
        0,
        20
      )}`
    )
  }
  if (!tyson.startsWith('value|'))
    throw new Error(
      `Unable to parse TySON. Expected sort path value, but found ${tyson.slice(
        0,
        20
      )}`
    )
  tyson = skipChars(tyson.slice(6))
  // eslint-disable-next-line prefer-const
  let [rTyson, path] = decodeString(tyson)
  if (!rTyson.startsWith(')'))
    throw new Error(
      `Unable to parse TySON. Expected  value, but found ${tyson.slice(0, 20)}`
    )
  rTyson = skipChars(rTyson.slice(1))
  const sortOp: SortOp = sortDir === 'asc' ? { asc: path } : { desc: path }
  if (rTyson.startsWith(']')) {
    rTyson = skipChars(rTyson.slice(1))
    if (sortOps.length === 0) {
      return [rTyson, sortOp]
    }
    return [rTyson, [...sortOps, sortOp] as unknown as SortOps]
  }
  if (!rTyson.startsWith(','))
    throw new Error(
      `Unable to parse Tyson. Expected comma (,) or end of sort array, but found: ${rTyson.slice(
        0,
        20
      )}`
    )
  return decodeSortOp(skipChars(rTyson.slice(1)), [...sortOps, sortOp])
}
