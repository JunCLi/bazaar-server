const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 12
const crypto = require('crypto')
const Promise = require('bluebird')
const authenticate = require('../authenticate')

const { createSelectQuery, createUpdateQuery, createInsertQuery  } = require ('../../utils')

/* For Emergencies only */
const emergencysignup = require('./signup')  /* <-- Use Me for emergencies */
/* For Emergencies only */


module.exports = {
  Mutation: {
    async signUp(parent, {input}, {req, app, postgres}){
      try {
        let {email, password} = input
        email = email.toLowerCase()
  
        const checkUniqueEmailQuery = {
          text: `SELECT email FROM bazaar.users WHERE email = '${email}'`
        } 
        const checkUniqueEmailResult = await postgres.query(checkUniqueEmailQuery)
        if (checkUniqueEmailResult.rows.length) throw 'This email has been taken'
  
        let hashedPassword = await bcrypt.hash(password, saltRounds)
        const newUserObject = {
          email: email,
          password: hashedPassword,
          user_status: 'active',
        }

        const newUserQuery = createInsertQuery(newUserObject, 'bazaar.users')
        const insertNewUser = await postgres.query(newUserQuery)
        
        
        
        let myJWTToken = await jwt.sign({
          data: insertNewUser.rows[0],
          exp: Math.floor(Date.now() / 1000 + 60 * 60)
        }, 'secret')
        
        console.log('user', insertNewUser.rows[0])
        console.log('token', myJWTToken)

        req.res.cookie('baazar_app', myJWTToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
        
        return {
          message: 'success'
        }
      } catch(err) {
        throw err
      }
    },

    async login(parent, {input}, {req, app, postgres}){
      try {
        let {email, password} = input
        email = email.toLowerCase()
  
        const passwordQuery = createSelectQuery(['password'], 'bazaar.users', 'email', email)
        const queryResult = await postgres.query(passwordQuery)

        if (!queryResult.rows.length) throw 'incorrect email'

        const dbPassword = queryResult.rows[0].password
        const match = await bcrypt.compare(password, dbPassword)

        if (!match) throw 'incorrect password'
  
        changeStatusObject = {
          user_status: 'active',
          email: email
        }

        const loginQuery = createUpdateQuery(changeStatusObject, 'email', 'bazaar.users')
        await postgres.query(loginQuery)

        return {
          message: 'success'
        }
      }catch(err) {
        throw err
      }
    },

    async updateUser(parent, {input}, {req, app, postgres}){
      try {
        const updateUserQuery = createUpdateQuery(input, 'id', 'bazaar.users')
        await postgres.query(updateUserQuery)
        return {
          message: 'success'
        }
      } catch(err) {
        throw err
      }
    },

    async registerItem(parent, {input}, {req, app, postgres}){
      const insertNewItem = createInsertQuery(input, 'bazaar.items')
      await postgres.query(insertNewItem)
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
      const {input: inputObject} = input
      
      const updateItemQuery = createUpdateQuery(inputObject, 'id', 'bazaar.items')

      await postgres.query(updateItemQuery)
      return {
        message: 'success'
      }
    },
  },
}



