import { FuncDecodeCollection } from '../types'
import { decodeString } from './decodeString'

export const decodeCollection: FuncDecodeCollection = (tyson) => {
  return decodeString(tyson)
}
