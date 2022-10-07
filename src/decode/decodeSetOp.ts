import { PathOp, RootOrPathOp, SetOps } from '../types'
import { decodeScalar } from './decodeScalar'
import { decodeString } from './decodeString'
import { skipChars } from './skipChars'

export const decodeSetOp = (
  tyson: string,
  sets: RootOrPathOp[] = []
): [tyson: string, set: SetOps] => {
  if (tyson.startsWith('root')) {
    if (sets.length > 0)
      throw new Error(
        `Unable to parse Tyson. Only single root set allowed, but found: ${tyson.slice(
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
    // eslint-disable-next-line prefer-const
    let [rTyson, val] = decodeScalar(skipChars(tyson.slice(1)), true)
    if (rTyson.startsWith(',')) rTyson = skipChars(rTyson.slice(1))
    if (!rTyson.startsWith('}'))
      throw new Error(
        `Unable to parse TySON. Expected root set operation to only have root value, but found ${rTyson.slice(
          0,
          20
        )}`
      )
    const set: RootOrPathOp = { root: val }
    return [skipChars(rTyson), set]
  } else if (tyson.startsWith('value|')) {
    tyson = skipChars(tyson.slice(6))
    // eslint-disable-next-line prefer-const
    let [rTyson, path] = decodeString(tyson, true)
    if (!rTyson.startsWith(':'))
      throw new Error(
        `Unable to parse TySON. Expected colon (:), but found ${rTyson.slice(
          0,
          20
        )}`
      )
    rTyson = skipChars(rTyson.slice(1))
    const [r2Tyson, value] = decodeScalar(rTyson, true)
    const setOp: PathOp = { path, value }
    if (r2Tyson.startsWith(',')) {
      return decodeSetOp(skipChars(r2Tyson.slice(1)), [...sets, setOp])
    }
    if (sets.length > 0) {
      const incOps: SetOps = [...sets, setOp] as unknown as SetOps
      return [skipChars(r2Tyson), incOps]
    }
    return [skipChars(r2Tyson), setOp]
  }
  throw new Error(
    `Unable to parse Tyson. Expected "root" or "value|" map key, but found: ${tyson.slice(
      0,
      20
    )}`
  )
}
