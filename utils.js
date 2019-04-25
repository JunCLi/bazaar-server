module.exports.createSelectQuery = (selectColumns, selector, selectorValue, table) => {
  const queryString = selectColumns.join(', ')
  return {
    text: `SELECT ${queryString} FROM ${table} WHERE ${selector} = '${selectorValue}'`
  }
}

module.exports.createInsertQuery = (inputObject, table) => {
  const queryKeys = Object.keys(inputObject)
  const queryValues = Object.values(inputObject)
  const queryString = queryKeys.join(', ')
  const queryValuesString = queryKeys.map(
    (key, index) => `$${index + 1}`
  ).join(', ')

  return {
    text: `INSERT INTO ${table} (${queryString}) VALUES (${queryValuesString})`,
    values: queryValues
  }
}

module.exports.createUpdateQuery = (inputObject, selector, table) => {  
  const queryKeys = Object.keys(inputObject).filter(
    key => inputObject[key] !== null && key !== selector
  )
  const queryValues = queryKeys.map(key => inputObject[key])
  const queryString = queryKeys.map((key, index) => {
    return `${key} = $${index + 1}`
  }).join(', ')

  return {
    text: `UPDATE ${table} SET ${queryString} WHERE ${selector} = '${inputObject[selector]}'`,
    values: queryValues
  }
}