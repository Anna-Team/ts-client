import { FuncDecodeBool } from '../types'

export const decodeBool: FuncDecodeBool = (tyson) => {
  switch (true) {
    case tyson.startsWith('1|'):
      return [tyson.slice(2), true]
    case tyson.startsWith('0|'):
      return [tyson.slice(2), false]
    case new RegExp(/^true\|/i).test(tyson):
      return [tyson.slice(5), true]
    case new RegExp(/^false\|/i).test(tyson):
      return [tyson.slice(6), false]
    default:
      throw new Error(
        `Unable to parse TySON. Expected Boolean, but found ${tyson.slice(
          0,
          20
        )}}`
      )
  }
}
