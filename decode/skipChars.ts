import { FuncSkipChars } from "../types"

export const ws = [" ", "\t", "\r", "\n"]
export const skipChars: FuncSkipChars = (tyson, chars = ws) => {
  var len = 0
  while (
    chars.some((char) => {
      if (tyson.startsWith(char)) {
        len = char.length
        return true
      }
      return false
    })
  ) {
    tyson = tyson.slice(len)
  }
  return tyson
}
