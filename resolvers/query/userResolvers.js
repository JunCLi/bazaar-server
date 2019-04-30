const authenticate = require('../authenticate')

const { createSelectQuery } = require('../../utils')

module.exports = {
  User: {
    async usersItems(parent, input, {req, app, postgres}){
      const user_id = authenticate(app, req)

      const selectColumns = [
        'id',
        'item_name',
        'item_type',
        'item_status',
        'item_price',
        'item_inventory',
        'item_description'
      ]

      const itemsQuery = createSelectQuery(selectColumns, 'bazaar.items', 'item_owner_id', user_id)
      const itemsQueryResult = await postgres.query(itemsQuery)

      const itemsArray = itemsQueryResult.rows.map(itemRow => {
        const {id, item_name, item_type, item_status, item_price, item_inventory, item_description} = itemRow
        return {
          id,
          item_name,
          item_type,
          item_status,
          item_price,
          item_inventory,
          item_description
        }
      })

      return itemsArray
    }
  }
}