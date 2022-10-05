import {
  FindOps,
  LogicalOperator,
  LogicalOperators,
  RootOrPathOp,
} from "../types"
import { encodePathOrRoot } from "./encodePathOrRoot"

const encodeFindOp = (findOp: LogicalOperators): string => {
  var tyson = ""
  const findOperator = Object.keys(findOp)[0] as keyof LogicalOperator
  switch (findOperator) {
    case "eq":
    case "neq":
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      {
        const operation = findOp[findOperator] as RootOrPathOp
        tyson += `${findOperator}{${encodePathOrRoot(operation)}}`
      }
      break
    case "not":
      {
        const operation = findOp[findOperator]
        tyson += `${findOperator}(${encodeFindOp(
          operation as LogicalOperators
        )})`
      }
      break
    default: {
      throw new Error(`Error parsing find operation: ${findOperator}`)
    }
  }
  return tyson
}

export const encodeFindOps = (findOps: FindOps): string => {
  const ops = !Array.isArray(findOps) ? [findOps] : findOps
  return ops.map((op) => encodeFindOp(op)).join(",")
}
