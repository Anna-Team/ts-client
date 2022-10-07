import {
  ArrayPipe,
  FuncDecodeQuery,
  Mutation,
  Operator,
  Root,
  SinglePipe,
} from '../types'
import { decodeCollection } from './decodeCollection'
import { decodeOperation } from './decodeOperation'
import { skipChars } from './skipChars'

export const decodeQuery: FuncDecodeQuery = (tyson) => {
  // eslint-disable-next-line prefer-const
  let [rTyson, collection] = decodeCollection(tyson)
  rTyson = skipChars(rTyson)
  if (!rTyson.startsWith(':'))
    throw new Error(
      `Unable to Parse TySON. Expected colon (:), but found ${tyson.slice(
        0,
        20
      )}}`
    )
  rTyson = skipChars(rTyson.slice(1))
  if (rTyson.startsWith('q[')) {
    rTyson = skipChars(rTyson.slice(2))
    let operations: ArrayPipe | undefined = undefined
    let firstPipe = true
    while (!rTyson.startsWith(']')) {
      const [rTyson2, operation] = decodeOperation(rTyson, firstPipe)
      firstPipe = false
      if (operations === undefined) {
        operations = [operation as Root]
      } else {
        operations = [...operations, operation as Operator | Mutation]
      }
      rTyson = skipChars(rTyson2)
      if (rTyson.startsWith(',')) rTyson = skipChars(rTyson.slice(1))
    }
    rTyson = skipChars(rTyson.slice(1))
    if (operations === undefined)
      throw Error(
        `Unable to Parse TySON. Expected at least one operation, but found none: ${tyson.slice(
          0,
          20
        )}}`
      )
    return [skipChars(rTyson), { collection, pipeline: operations }]
  }
  const [r2Tyson, operation] = decodeOperation(rTyson, true)
  return [
    r2Tyson,
    {
      collection,
      pipeline: operation as SinglePipe,
    },
  ]
}
