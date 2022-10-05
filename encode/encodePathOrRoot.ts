import { RootOrPathOp } from "../types"
import { encodeFieldName } from "./encodeFieldNames"
import { encodeItem } from "./encodeItems"

export const encodePathOrRoot = (op: RootOrPathOp): string => {
  var tyson = ""
  if ("root" in op) {
    tyson += `root:${encodeItem(op.root)}`
  } else if ("path" in op) {
    tyson += `${encodeFieldName(op.path)}:${encodeItem(op.value)}`
  }
  return tyson
}
