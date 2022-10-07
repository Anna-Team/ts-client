import { FuncDecodeError } from '../types'
import { decodeString } from './decodeString'

export const decodeError: FuncDecodeError = (tyson) => {
  const [rTyson, error] = decodeString(tyson)
  tyson = rTyson
  if (tyson.startsWith(';')) tyson = tyson.slice(1)
  return [rTyson, { error }]
}
