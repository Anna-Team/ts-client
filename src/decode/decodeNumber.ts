import { FuncDecodeNumber } from '../types'
import { skipChars } from './skipChars'

export const decodeNumber: FuncDecodeNumber = (tyson) => {
  const num = tyson.match(/^([0-9]+)\|/)?.[1]
  if (num === undefined)
    throw new Error(
      `Unable to parse TySON. Expected Number, but found ${tyson.slice(0, 20)}}`
    )
  const parsedNum = num.includes('.') ? parseFloat(num) : parseInt(num)
  if (isNaN(parsedNum))
    throw new Error(
      `Unable to parse TySON. Expected Number, but found ${tyson.slice(0, 20)}}`
    )
  return [skipChars(tyson.slice(num.length + 1)), parsedNum]
}
