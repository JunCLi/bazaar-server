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
      let {name, type, status, price, inventory} = input

      const newItemInsert = {
        text: 'INSERT INTO bazaar.items (item_name, item_type, item_status, item_price, item_inventory) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: [name, type, status, price, inventory]
      }

      await postgres.query(newItemInsert)
      return {
        message: 'success'
      }
    },

    async removeItem(parent, input, {req, app, postgres}){
      let {id} = input

      const removeItemQuery = {
        text: `DELETE FROM bazaar.items WHERE id = '${id}'`
      }
      await postgres.query(removeItemQuery)
      return {
        message: 'successfully removed item'
      }
    },

    async purchaseItem(parent, input, {req, app, postgres}){
      let {id, status, inventory} = input

      const purchaseItemQuery = {

      }
    }
  },
}



