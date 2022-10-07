import { FuncDecodeItemMap } from '../types'
import { decodeCollectionID } from './decodeCollectionID'
import { decodeScalar } from './decodeScalar'

export const decodeItemMap: FuncDecodeItemMap = (tyson, items = {}) => {
  const [rTyson, colId] = decodeCollectionID(tyson)
  const [r2Tyson, scalar] = decodeScalar(rTyson, false)
  tyson = r2Tyson
  const id = colId._id
  items[id] = scalar
  if (tyson.startsWith(',')) tyson = tyson.slice(1)
  if (tyson.startsWith('}')) return [tyson.slice(1), items]
  return decodeItemMap(tyson, items)
}
