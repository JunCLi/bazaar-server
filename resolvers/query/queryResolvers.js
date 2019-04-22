const authenticate = require('../authenticate')

module.exports = {
  Query: {
    async getAllUsers(parent, input, {req, app, postgres}){
      const usersQuery = {
        text: 'SELECT id, email, user_status, user_date_created, fullname, username FROM bazaar.users'
      }

      const usersQueryResult = await postgres.query(usersQuery)

      const usersArray = usersQueryResult.rows.map(userQuery => {
        const {id, email, user_status, user_date_created, fullname, username} = userQuery
        return {
          id, 
          email,
          user_status,
          user_date_created,
          fullname,
          username
        }
      })

      return usersArray
    },

    async getUser(parent, input, {req, app, postgres}){
      const {id} = input
      
      const userQuery = {
        text: `SELECT id, email, user_status, user_date_created, fullname, username FROM bazaar.users WHERE id = '${id}'`
      }

      const userQueryResult = await postgres.query(userQuery)
      const {email, user_status, user_date_created, fullname, username} = userQueryResult.rows[0]

      return {
        id,
        email,
        user_status,
        user_date_created,
        fullname,
        username
      }
    },

    async getAllItems(parent, input, {req, app, postgres}){
      const itemsQuery = {
        text: 'SELECT id, item_owner_id, item_name, item_type, item_status, item_price, item_inventory, date_added FROM bazaar.items'
      }

      const itemsQueryResult = await postgres.query(itemsQuery)

      const itemsArray = itemsQueryResult.rows.map(itemQuery => {
        const {id, item_owner_id, item_name, item_type, item_status, item_price, item_inventory, date_added} = itemQuery
        return {
          id,
          item_owner_id,
          item_name,
          item_type,
          item_status,
          item_price,
          item_inventory,
          date_added
        }
      })

      return itemsArray
    },

    async getItem(parent, input, {req, app, postgres}){
      const {id} = input
      
      const itemQuery = {
        text: `SELECT id, item_owner_id, item_name, item_type, item_status, item_price, item_inventory, date_added FROM bazaar.items WHERE id = '${id}'`
      }

      const itemQueryResult = await postgres.query(itemQuery)
      const {item_owner_id, item_name, item_type, item_status, item_price, item_inventory, date_added} = itemQueryResult.rows[0]

      return {
        id,
        item_owner_id,
        item_name,
        item_type,
        item_status,
        item_price,
        item_inventory,
        date_added
      }
    },

    async getAllTransactions(parent, input, {req, app, postgres}){
      const {user_id} = input
      
      const transactionsQuery = {
        text: `SELECT id, item_id, purchased_by_id, purchased_from_id, status, date_of_purchase, purchase_price, purchase_quantity FROM bazaar.transactions WHERE purchased_from_id = '${user_id}' OR purchased_by_id = '${user_id}'`
      }

      const transactionsQueryResult = await postgres.query(transactionsQuery)
      const transactionsArray = transactionsQueryResult.rows.map(transactionQuery => {
        const {id, item_id, purchased_by_id, purchased_from_id, status, date_of_purchase, purchase_price, purchase_quantity} = transactionQuery
        return {
          id,
          item_id,
          purchased_by_id,
          purchased_from_id,
          status,
          date_of_purchase,
          purchase_price,
          purchase_quantity
        }
      })

      return transactionsArray
    },

    async getTransaction(parent, input, {req, app, postgres}){
      const {id} = input

      const transactionQuery = {
        text: `SELECT item_id, purchased_by_id, purchased_from_id, status, date_of_purchase, purchase_price, purchase_quantity FROM bazaar.transactions WHERE id = '${id}'`
      }

      const transactionQueryResult = await postgres.query(transactionQuery)
      const {item_id, purchased_by_id, purchased_from_id, status, date_of_purchase, purchase_price, purchase_quantity} = transactionQueryResult.rows[0]

      return {
        id, 
        item_id,
        purchased_by_id,
        purchased_from_id,
        status,
        date_of_purchase,
        purchase_price,
        purchase_quantity
      }
    },
  },
}
