module.exports.createSelectQuery = (selectColumns, table, selector, selectorValue) => {
  const queryString = selectColumns.join(', ')
  
  if (selector) {
    return {
      text: `SELECT ${queryString} FROM ${table} WHERE ${selector} = '${selectorValue}'`
    }
  } else {
    return {
      text: `SELECT ${queryString} FROM ${table}`
    }
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
    text: `INSERT INTO ${table} (${queryString}) VALUES (${queryValuesString}) RETURNING *`,
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