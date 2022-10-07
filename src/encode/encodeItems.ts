import { InsertOp, ScalarOrLink } from '../types'

export const encodeItem = (item: InsertOp): string => {
  if (typeof item === 'string') {
    // item is a string
    return `s|${item}|`
  } else if (typeof item === 'number') {
    // item is a number
    return `n|${item}|`
  } else if (typeof item === 'boolean') {
    // item is a boolean
    return `b|${item}|`
  } else if (Array.isArray(item)) {
    // item is a vector (array)
    let tyson = 'v['
    item.forEach((subItem, i) => {
      if (i > 0) {
        tyson += ','
      }
      tyson += encodeItem(subItem)
    })
    return (tyson += ']')
  } else if (typeof item === 'object') {
    if (item === null) {
      // item is null
      return 'null'
    } else if (item instanceof Date) {
      // item is a Date (Unix TimeStamp)
      return `uts|${item.getTime()}|`
    } else {
      if (
        Object.keys(item).length == 2 &&
        typeof item?.type === 'string' &&
        typeof item?.id === 'string'
      ) {
        // item is a Link
        return `${item.type}|${item.id}|`
      } else {
        // item is a map (object)
        let tyson = 'm{'
        Object.keys(item).forEach((key, i) => {
          if (i > 0) {
            tyson += ','
          }
          tyson += `s|${key}|:`
          tyson += encodeItem((item as Record<string, ScalarOrLink>)[key])
        })
        return (tyson += '}')
      }
    }
  }
  throw new Error(`Error parsing item: ${item}`)
}

export const encodeItems = (items: InsertOp[]): string => {
  return items.map((item) => encodeItem(item)).join(',')
}
