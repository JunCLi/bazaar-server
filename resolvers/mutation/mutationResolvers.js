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
    // async signup( parent, { input: { email, password }, }, { req, app, postgres }) {
    //   /* TODO: Add signup functionality */
    // }
    /* TODO: Add more resolvers */
  },
}



