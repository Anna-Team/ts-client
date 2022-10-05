import { FuncDecodeCollectionID } from "../types"
import { decodeString } from "./decodeString"

export const decodeCollectionID: FuncDecodeCollectionID = (tyson) => {
  const [rTyson, collection] = decodeString(tyson)
  if (collection.length < 1)
    throw new Error(
      `Unable to Parse TySON. Expected Collection to not be null, but found: ${tyson.slice(
        0,
        20
      )}}`
    )
  const [r2Tyson, id] = decodeString(rTyson)
  if (id.length < 1)
    throw new Error(
      `Unable to Parse TySON. Expected ID to not be null, but found: ${rTyson.slice(
        0,
        20
      )}}`
    )
  return [
    r2Tyson,
    {
      _collection: collection,
      _id: id,
    },
  ]
}
