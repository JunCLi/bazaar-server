const authenticate = require('../authenticate')

const { createSelectQuery } = require('../../utils')

module.exports = {
  Query: {
    async getAllUsers(parent, input, {req, app, postgres}){
      const selectColumns = [
        'id',
        'email',
        'user_status',
        'user_date_created',
        'fullname'
      ]

      const usersQuery = createSelectQuery(selectColumns, 'bazaar.users')
      const usersQueryResult = await postgres.query(usersQuery)

      const usersArray = usersQueryResult.rows.map(userQuery => {
        const {id, email, user_status, user_date_created, fullname } = userQuery
        return {
          id, 
          email,
          user_status,
          user_date_created,
          fullname,
        }
      })

      return usersArray
    },

    async getUser(parent, input, {req, app, postgres}){
      const {id} = input
      
      const selectColumns = [
        'email',
        'user_status',
        'user_date_created',
        'fullname',
      ]

      const userQuery = createSelectQuery(selectColumns, 'bazaar.users', 'id', id)

      const userQueryResult = await postgres.query(userQuery)
      const {email, user_status, user_date_created, fullname } = userQueryResult.rows[0]

      return {
        id,
        email,
        user_status,
        user_date_created,
        fullname,
      }
    },

    async getLoggedUser(parent, input, {req, app, postgres}){
      try {
        const user_id = authenticate(app, req)
        const selectColumns = [
          'id',
          'fullname'
        ]

        const userQuery = createSelectQuery(selectColumns, 'bazaar.users', 'id', user_id)

        const userQueryResult = await postgres.query(userQuery)
        const {id, fullname} = userQueryResult.rows[0]

        return {
          id,
          fullname
        }
      } catch(err) {
        console.log(err)
      }
      
    },

    async getAllItems(parent, input, {req, app, postgres}){
      const selectColumns = [
        'id',
        'item_owner_id',
        'item_name',
        'item_type',
        'item_status',
        'item_price',
        'item_inventory',
        'item_description',
        'date_added',
      ]

      const itemsQuery = createSelectQuery(selectColumns, 'bazaar.items')
      const itemsQueryResult = await postgres.query(itemsQuery)

      const itemsArray = itemsQueryResult.rows.map(itemQuery => {
        const {id, item_owner_id, item_name, item_type, item_status, item_price, item_inventory, item_description, date_added, fullname: item_owner_name} = itemQuery

        return {
          id,
          item_owner_id,
          item_name,
          item_type,
          item_status,
          item_price,
          item_inventory,
          item_description,
          date_added,
          item_owner_name
        }
      })

      return itemsArray
    },

    async getItem(parent, input, {req, app, postgres}){
      const {id} = input

      const selectColumns = [
        'id',
        'item_owner_id',
        'item_name',
        'item_type',
        'item_status',
        'item_price',
        'item_inventory',
        'item_description',
        'date_added',
      ]

      const itemQuery = createSelectQuery(selectColumns, 'bazaar.items', 'id', id)
      const itemQueryResult = await postgres.query(itemQuery)
      
      const {item_owner_id, item_name, item_type, item_status, item_price, item_inventory, item_description, date_added, fullname: item_owner_name} = itemQueryResult.rows[0]

      return {
        id,
        item_owner_id,
        item_name,
        item_type,
        item_status,
        item_price,
        item_inventory,
        item_description,
        date_added,
        item_owner_name
      }
    },

    async getAllTransactions(parent, input, {req, app, postgres}){
      const {user_id} = input
      
      const transactionsQuery = {
        text: `SELECT id, item_id, purchased_by_id, purchased_from_id, status, date_of_purchase, purchase_price, purchase_quantity FROM bazaar.transactions WHERE purchased_from_id = $1 OR purchased_by_id = $1`,
        values: [user_id]
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
