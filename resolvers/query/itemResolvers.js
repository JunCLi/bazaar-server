const authenticate = require('../authenticate')

const { createSelectQuery } = require('../../utils')

module.exports = {
  Item: {
    async itemOwner(parent, input, {req, app, postgres}){
      const { item_owner_id } = parent

      const selectColumns = [
        'id',
        'email',
        'fullname',
      ]

      const userQuery = createSelectQuery(selectColumns, 'bazaar.users', 'id', item_owner_id)
      const userQueryResult = await postgres.query(userQuery)
      const { id, email, fullname } = userQueryResult.rows[0]

      return {
        id,
        email,
        fullname
      }
    }
  }
}