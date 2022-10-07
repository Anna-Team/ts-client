import { AllOps, OpKeys } from '../types'
import { encodeFindOps } from './encodeFindOps'
import { encodeInsert } from './encodeInsert'
import { encodeItem } from './encodeItems'
import { encodeSortOps } from './encodeSortOps'
import { encodeUpdateOp } from './encodeUpdateOp'

export const encodeOp = (o: AllOps): string => {
  const op = o as Required<AllOps>
  const operation: OpKeys = Object.keys(op)[0] as OpKeys
  let tyson = ''
  switch (operation) {
    case 'insert':
      tyson = `${operation}[`
      tyson += encodeInsert(op.insert)
      tyson += `]`
      break
    case 'get':
      tyson = `${operation}[`
      tyson += encodeItem(op.get)
      tyson += `]`
      break
    case 'find':
      {
        tyson = `${operation}[`
        tyson += encodeFindOps(op.find)
        tyson += `]`
      }
      break
    case 'sort':
      {
        tyson = `${operation}[`
        tyson += encodeSortOps(op.sort)
        tyson += `]`
      }
      break
    case 'limit':
    case 'offset':
      tyson += `${operation}(n|${op[operation]}|)`
      break
    case 'update':
      {
        tyson = `${operation}[`
        const updateOp = op.update
        if (Array.isArray(updateOp)) {
          updateOp.forEach((update, i) => {
            if (i > 0) {
              tyson += ','
            }
            tyson += encodeUpdateOp(update)
          })
        } else if (typeof updateOp !== 'undefined') {
          tyson += encodeUpdateOp(updateOp)
        }
        tyson += `]`
      }
      break
    case 'delete':
      tyson += `${operation}`
    default: {
    }
  }
  return tyson
}
