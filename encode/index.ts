import { AllOps, ArrayPipe, Query } from "../types"
import { encodeOp } from "./encodeOp"

export const encodeTyson = (query: Query): string => {
  var tyson: string = `collection|${query.collection}|:`
  if (Array.isArray(query.pipeline)) {
    tyson += "q["
    ;(query.pipeline as ArrayPipe).forEach((op: AllOps, i: number) => {
      if (i > 0) {
        tyson += ","
      }
      tyson += encodeOp(op)
    })
    tyson += "]"
  } else {
    tyson += encodeOp(query.pipeline)
  }
  return (tyson += ";")
}
