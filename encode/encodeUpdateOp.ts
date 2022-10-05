import { IncOpPath, IncOpRoot, RootOrPathOp, UpdateOp } from "../types"
import { encodePathOrRoot } from "./encodePathOrRoot"

export const encodeUpdateOp = (op: UpdateOp) => {
  var tyson = ""
  const updateKey = Object.keys(op)[0] as keyof UpdateOp
  const updateOp = op as Required<UpdateOp>
  tyson += `${updateKey}{`
  switch (updateKey) {
    case "set":
      {
        const setOp = updateOp[updateKey]
        const setOps = Array.isArray(setOp)
          ? setOp
          : ([setOp] as RootOrPathOp[])
        tyson += setOps.map((setOp) => encodePathOrRoot(setOp)).join(",")
      }
      break
    case "inc":
      {
        if (typeof (updateOp[updateKey] as any).root === "number") {
          const IncOp = updateOp[updateKey] as IncOpRoot
          // if IncOp has key root, then root will be a number
          tyson += `root:n|${IncOp.root}|`
        } else {
          const IncOp = updateOp[updateKey] as IncOpPath
          // otherwise, it will be an array of objects with path and by
          tyson += `value|${IncOp.path}|:n|${IncOp.by}|`
        }
      }
      break
    default: {
      throw new Error(`Error parsing update operation: ${updateKey}`)
    }
  }
  tyson += `}`
  return tyson
}
