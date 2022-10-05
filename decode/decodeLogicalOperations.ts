import {
  ArrayAtLeastOne,
  FuncDecodeLogicalOperation,
  LogicOpOrCompOp,
} from "../types"
import { decodePathOrRootOp } from "./decodePathOrRootOp"
import { skipChars } from "./skipChars"

export const decodeLogicalOperations: FuncDecodeLogicalOperation = (
  tyson: string
) => {
  switch (true) {
    case tyson.startsWith("eq{"): {
      tyson = skipChars(tyson.slice(3))
      var [rTyson, eq] = decodePathOrRootOp(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("}"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { eq }]
    }
    case tyson.startsWith("neq{"): {
      tyson = skipChars(tyson.slice(4))
      var [rTyson, neq] = decodePathOrRootOp(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("}"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { neq }]
    }
    case tyson.startsWith("gt{"): {
      tyson = skipChars(tyson.slice(3))
      var [rTyson, gt] = decodePathOrRootOp(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("}"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { gt }]
    }
    case tyson.startsWith("gte{"): {
      tyson = skipChars(tyson.slice(4))
      var [rTyson, gte] = decodePathOrRootOp(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("}"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { gte }]
    }
    case tyson.startsWith("lt{"): {
      tyson = skipChars(tyson.slice(3))
      var [rTyson, lt] = decodePathOrRootOp(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("}"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { lt }]
    }
    case tyson.startsWith("lte{"): {
      tyson = skipChars(tyson.slice(4))
      var [rTyson, lte] = decodePathOrRootOp(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("}"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { lte }]
    }
    case tyson.startsWith("not("): {
      tyson = skipChars(tyson.slice(4))
      var [rTyson, not] = decodeLogicalOperations(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith(")"))
        throw new Error(
          `Unable to parse TySON. Expected a close of operation with "}", but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { not }]
    }
    case tyson.startsWith("or["): {
      tyson = skipChars(tyson.slice(3))
      const ors: LogicOpOrCompOp[] = []
      while (!tyson.startsWith("]")) {
        var [rTyson, or] = decodeLogicalOperations(skipChars(tyson))
        tyson = skipChars(rTyson)
        ors.push(or)
        if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
      }
      if (ors.length === 0)
        throw new Error(
          `Unable to parse TySON. Expected at least one operation in "or" logical operation, but found: ${tyson.slice(
            0,
            20
          )}`
        )
      tyson = skipChars(tyson.slice(1))
      return [tyson, { or: ors as ArrayAtLeastOne<LogicOpOrCompOp> }]
    }
    case tyson.startsWith("and["): {
      tyson = skipChars(tyson.slice(4))
      const ands: LogicOpOrCompOp[] = []
      while (!tyson.startsWith("]")) {
        var [rTyson, and] = decodeLogicalOperations(skipChars(tyson))
        tyson = skipChars(rTyson)
        if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
        ands.push(and)
      }
      if (ands.length === 0)
        throw new Error(
          `Unable to parse TySON. Expected at least one operation in "or" logical operation, but found: ${tyson.slice(
            0,
            20
          )}`
        )
      tyson = skipChars(tyson.slice(1))
      return [tyson, { and: ands as ArrayAtLeastOne<LogicOpOrCompOp> }]
    }
    default:
      throw new Error(
        `Unable to parse TySON. Expected a logical operation, but found: ${tyson.slice(
          0,
          20
        )}`
      )
  }
}
