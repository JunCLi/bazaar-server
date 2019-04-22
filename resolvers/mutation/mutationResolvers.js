const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 12
const crypto = require('crypto')
const Promise = require('bluebird')
const authenticate = require('../authenticate')

/* For Emergencies only */
const emergencysignup = require('./signup')  /* <-- Use Me for emergencies */
/* For Emergencies only */


module.exports = {
  Mutation: {
    async signUp(parent, input, {req, app, postgres}){
      let {email, password} = input
      email = email.toLowerCase()

      const checkUniqueEmailQuery = {
        text: `SELECT email FROM bazaar.users WHERE email = '${email}'`
      } 
      const checkUniqueEmailResult = await postgres.query(checkUniqueEmailQuery)
      if (checkUniqueEmailResult.rows.length) {
        return {
          message: 'This email has been taken'
        }
      }

      let hashedPassword = await bcrypt.hash(password, saltRounds)
      const newUserInsert = {
        text: 'INSERT INTO bazaar.users (email, password) VALUES ($1, $2) RETURNING *',
        values: [email, hashedPassword]
      }

      await postgres.query(newUserInsert)
      return {
        message: 'success'
      }
    },

    async login(parent, input, {req, app, postgres}){
      let {email, password} = input
      email = email.toLowerCase()

      const queryDbPassword = {
        text: `SELECT password FROM bazaar.users WHERE email = '${email}'`
      }

      const queryResult = await postgres.query(queryDbPassword)
      if (!queryResult.rows.length) {
        return {
          message: 'incorrect email'
        }
      } 
      const dbPassword = queryResult.rows[0].password
      const match = await bcrypt.compare(password, dbPassword)
      const responseMessage = match ? 'success' : 'incorrect password'

      return {
        message: responseMessage
      }
    },

    async registerItem(parent, input, {req, app, postgres}){
      let {item_name, item_type, item_price, item_inventory, item_owner_id} = input

      const newItemInsert = {
        text: 'INSERT INTO bazaar.items (item_name, item_type, item_status, item_price, item_inventory, item_owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [item_name, item_type, 'listed', item_price, item_inventory, item_owner_id]
      }

      await postgres.query(newItemInsert)
      return {
        message: 'success'
      }
    },

    async purchaseItem(parent, input, {req, app, postgres}){
      try {
        let {purchase_by_id, item_id, purchase_quantity} = input

        const listedItemQuery = {
          text: `SELECT item_owner_id, item_status, item_inventory, item_price FROM bazaar.items WHERE id = '${item_id}'`
        }
        
        const listedItemQueryResult = await postgres.query(listedItemQuery)
        const {item_owner_id, item_status, item_inventory, item_price} = listedItemQueryResult.rows[0]

        if (item_status !== 'listed') throw 'This item is not for sale'
        if (item_inventory < purchase_quantity) throw 'Not enough items in inventory'
        if (purchase_by_id === item_owner_id) throw "You can't buy your own item!"
        
        const sensTransactionQuery = {
          text: 'INSERT INTO bazaar.sens_transactions (stripe_id) VALUES (13) RETURNING *'
        }

        const senTransactionQueryResult = await postgres.query(sensTransactionQuery)
        const sensTransactionID = senTransactionQueryResult.rows[0].id

        const transactionQuery = {
          text: 'INSERT INTO bazaar.transactions (item_id, sens_transaction_id, purchased_by_id, purchased_from_id, status, purchase_price, purchase_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          values: [item_id, sensTransactionID, purchase_by_id, item_owner_id, 'completed', item_price, purchase_quantity] 
        }
        const adjustQuantityQuery = {
          text: `UPDATE bazaar.items SET item_inventory = ${item_inventory - purchase_quantity} WHERE id = '${item_id}'`
        }

        await Promise.all([
          postgres.query(transactionQuery),
          postgres.query(adjustQuantityQuery)
        ])
        return {
          message: 'success'
        }

      }catch(err){
        console.log(err)
        throw err
      }
    },

    async removeItem(parent, input, {req, app, postgres}){
      const {item_id} = input

      const removeItemQuery = {
        text: `UPDATE bazaar.items SET item_status = 'removed' WHERE id = '${item_id}'`
      }
      await postgres.query(removeItemQuery)
      return {
        message: 'successfully removed item'
      }
    },

    async updateItem(parent, input, {req, app, postgres}){
      
    },
  },
}



