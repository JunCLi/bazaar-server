const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const authenticate = (app, req) => {
  console.log('token', req.cookies)

  return 1
}

module.exports = authenticate
