const authenticate = require('../authenticate')

module.exports = {
  Query: {
    async getAllItems(parent, input, {req, app, postgres}){
      const itemsQuery = {
        text: 'SELECT * FROM bazaar.items'
      }
      const itemsQueryResult = await postgres.query(itemsQuery)
      return itemsQueryResult.rows
    },

    async item(parent, input, {req, app, postgres}){
      let {id} = input
      
      const itemQuery = {
        text: `SELECT * FROM bazaar.items WHERE id = '${id}'`
      }

      const itemQueryResult = await postgres.query(itemQuery)
      console.log(itemQueryResult.rows[0])
      const {item_name, item_type, item_status, item_price, item_inventory} = itemQueryResult.rows[0]
      return {
        id,
        item_name,
        item_type,
        item_status,
        item_price,
        item_inventory
      }
    }
  },
}
