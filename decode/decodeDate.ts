import { FuncDecodeDate } from "../types"

export const decodeDate: FuncDecodeDate = (tyson) => {
  const uts = tyson.match(/^([0-9]+)\|/)?.[1]
  if (uts === undefined)
    throw new Error(
      `Unable to parse Tyson. Expected UTS, but found ${tyson.slice(0, 20)}}`
    )
  // uts is seconds since epoch, so multiply by 1000 to get milliseconds
  const date = new Date(parseInt(uts) * 1000)
  return [tyson.slice(uts.length + 1), date]
}
