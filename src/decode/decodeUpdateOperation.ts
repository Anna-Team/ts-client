import { FuncDecodeUpdateOperations, UpdateOps } from '../types'
import { decodeIncrementOp } from './decodeIncrementOp'
import { decodeSetOp } from './decodeSetOp'
import { skipChars } from './skipChars'

export const decodeUpdateOperation: FuncDecodeUpdateOperations = (
  tyson,
  operations = []
) => {
  switch (true) {
    case tyson.startsWith('set{'): {
      tyson = skipChars(tyson.slice(4))
      // eslint-disable-next-line prefer-const
      let [rTyson, setOp] = decodeSetOp(tyson)
      if (!rTyson.startsWith('}'))
        throw new Error(
          `Unable to parse TySON. Expected closing bracket "}", but found ${rTyson.slice(
            0,
            20
          )}`
        )
      rTyson = skipChars(rTyson.slice(1))
      if (rTyson.startsWith(',')) {
        return decodeUpdateOperation(skipChars(rTyson.slice(1)), [
          ...operations,
          { set: setOp },
        ])
      }
      if (operations.length > 0) {
        const updateOps = [
          ...operations,
          { set: setOp },
        ] as unknown as UpdateOps
        return [skipChars(rTyson), updateOps]
      }
      return [skipChars(rTyson), { set: setOp }]
    }
    case tyson.startsWith('inc{'): {
      tyson = skipChars(tyson.slice(4))
      // eslint-disable-next-line prefer-const
      let [rTyson, incrementOp] = decodeIncrementOp(tyson)
      if (!rTyson.startsWith('}'))
        throw new Error(
          `Unable to parse TySON. Expected closing bracket "}", but found ${rTyson.slice(
            0,
            20
          )}`
        )
      rTyson = skipChars(rTyson.slice(1))
      if (rTyson.startsWith(',')) {
        return decodeUpdateOperation(skipChars(rTyson.slice(1)), [
          ...operations,
          { inc: incrementOp },
        ])
      }
      if (operations.length > 0) {
        const updateOps = [
          ...operations,
          { inc: incrementOp },
        ] as unknown as UpdateOps
        return [skipChars(rTyson), updateOps]
      }
      return [skipChars(rTyson), { inc: incrementOp }]
    }
    default:
      throw new Error(
        `Unable to parse update operation. Expected "set" or "inc", but found: ${tyson.slice(
          0,
          20
        )}`
      )
  }
}
