import { AnyOp, FuncDecodeOperation, Link, LogicalOperator } from "../types"
import { decodeCollectionID } from "./decodeCollectionID"
import { decodeNumber } from "./decodeNumber"
import { decodeSortOp } from "./decodeSortOp"
import { decodeVector } from "./decodeVector"
import { decodeUpdateOperation } from "./decodeUpdateOperation"
import { skipChars } from "./skipChars"
import { decodeLogicalOperations } from "./decodeLogicalOperations"

export const decodeOperation: FuncDecodeOperation = (tyson, root = false) => {
  tyson = skipChars(tyson)
  switch (true) {
    case tyson.startsWith("insert["): {
      if (!root)
        throw new Error(
          `Unable to Parse TySON. Can only use insert operation in root position`
        )
      var [rTyson, newItems] = decodeVector(skipChars(tyson.slice(7)), true)
      // trailing close bracket is included in decodeVector
      return [skipChars(rTyson), { insert: newItems }]
    }
    case tyson.startsWith("get["): {
      tyson = skipChars(tyson.slice(4))
      const itemRefs: Link[] = []
      while (!tyson.startsWith("]")) {
        const [rTyson, itemRef] = decodeCollectionID(tyson)
        const link: Link = {
          type: itemRef._collection,
          id: itemRef._id,
        }
        itemRefs.push(link)
        tyson = skipChars(rTyson)
        if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
      }
      tyson = skipChars(tyson.slice(1))
      if (itemRefs.length === 0)
        throw new Error(
          `Unable to parse TySON. Get operation must have at least one item reference`
        )
      if (itemRefs.length === 1) return [tyson, { get: itemRefs[0] }]
      return [tyson, { get: itemRefs } as AnyOp]
    }
    case tyson.startsWith("find["): {
      tyson = skipChars(tyson.slice(5))
      const logic: LogicalOperator[] = []
      while (!tyson.startsWith("]")) {
        var [rTyson, pipe] = decodeLogicalOperations(skipChars(tyson))
        tyson = skipChars(rTyson)
        if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
        logic.push(pipe)
      }
      tyson = skipChars(tyson.slice(1))
      if (logic.length === 1) return [tyson, { find: logic[0] } as AnyOp]
      return [tyson, { find: logic } as AnyOp]
    }
    case tyson.startsWith("sort["): {
      var [rTyson, sort] = decodeSortOp(skipChars(tyson.slice(5)))
      return [rTyson, { sort } as AnyOp]
    }
    case tyson.startsWith("limit("): {
      tyson = skipChars(tyson.slice(6))
      if (!tyson.startsWith("n|"))
        throw new Error(
          `Unable to parse TySON. Expected limit number, but found: ${tyson.slice(
            0,
            20
          )}`
        )
      var [rTyson, limit] = decodeNumber(skipChars(tyson.slice(2)))
      if (!rTyson.startsWith(")"))
        throw new Error(
          `Unable to parse TySON. Expected parenthesis to close limit operation, but found: ${tyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { limit } as AnyOp]
    }
    case tyson.startsWith("offset("): {
      tyson = skipChars(tyson.slice(7))
      if (!tyson.startsWith("n|"))
        throw new Error(
          `Unable to parse TySON. Expected limit number, but found: ${tyson.slice(
            0,
            20
          )}`
        )
      var [rTyson, offset] = decodeNumber(skipChars(tyson.slice(2)))
      if (!rTyson.startsWith(")"))
        throw new Error(
          `Unable to parse TySON. Expected parenthesis to close limit operation, but found: ${tyson.slice(
            0,
            20
          )}`
        )
      return [skipChars(rTyson.slice(1)), { offset } as AnyOp]
    }
    case tyson.startsWith("update["): {
      tyson = skipChars(tyson.slice(7))
      var [rTyson, update] = decodeUpdateOperation(tyson)
      rTyson = skipChars(rTyson)
      if (!rTyson.startsWith("]")) {
        throw new Error(
          `Expected Update Operation to end with bracket ']', but found: ${rTyson.slice(
            0,
            20
          )}`
        )
      }
      return [skipChars(rTyson.slice(1)), { update } as AnyOp]
    }
    case tyson.startsWith("delete"): {
      tyson = skipChars(tyson.slice(6))
      if (tyson.startsWith(",")) tyson = skipChars(tyson.slice(1))
      return [tyson, { delete: true } as AnyOp]
    }
    default:
      throw new Error(
        `Unable to Parse TySON. Expected Operation, but found ${tyson.slice(
          0,
          20
        )}`
      )
  }
}
