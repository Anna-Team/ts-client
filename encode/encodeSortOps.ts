import { SortOp, SortOps } from '../types'
import { encodeFieldName } from './encodeFieldNames'

const encodeSortOp = (sortOp: SortOp): string => {
  const direction = Object.keys(sortOp)[0] as keyof SortOp
  const op = sortOp as Required<SortOp>
  const field = op[direction]
  return `${direction}(${encodeFieldName(field)})`
}

export const encodeSortOps = (sortOps: SortOps): string => {
  var tyson = ''
  const ops = !Array.isArray(sortOps) ? [sortOps] : sortOps
  tyson += ops.map((op) => encodeSortOp(op)).join(',')
  return tyson
}
