export const encodeFieldName = (field: string) => {
  return `value|${field}|`
}

export const encodeFieldNames = (fields: string[]) => {
  return fields.map((field) => encodeFieldName(field)).join(',')
}
