import { InsertOp } from '../types'
import { encodeItems } from './encodeItems'

export const encodeInsert = (i: InsertOp): string => {
  const items: InsertOp[] = !Array.isArray(i) ? [i] : i
  return encodeItems(items)
}
