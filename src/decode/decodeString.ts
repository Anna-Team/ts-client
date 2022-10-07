import { FuncDecodeString } from '../types'
import { skipChars } from './skipChars'

export const decodeString: FuncDecodeString = (tyson, allowEmpty = true) => {
  if (tyson.startsWith('|')) {
    if (allowEmpty) return [tyson.slice(1), '']
    throw new Error(
      `Expected nonEmpty string, but found empty string at: ${tyson.slice(
        0,
        20
      )}`
    )
  }
  const str = tyson.match(/^([^\|]+)\|/)?.[1]
  if (str === undefined)
    throw new Error(
      `Unable to Parse TySON. Expected String, but found: ${tyson.slice(
        0,
        20
      )}}`
    )
  return [skipChars(tyson.slice(str.length + 1)), str]
}
