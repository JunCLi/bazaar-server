const authenticate = require('../authenticate')

module.exports = {
  Query: {
    async test(parent, _, {postgres}, info){
      const getUsers = await postgres.query('SELECT * FROM boilerplate.users')
      return getUsers.rows[0].fullname
    }
    // async user(parent, { id }, { app, req, postgres }, info) {
    //   authenticate(app, req)
    //   const findUserQuery = {
    //     text: 'SELECT * FROM boilerplate.users WHERE id = $1',
    //     values: [id],
    //   }
    //   const user = await postgres.query(findUserQuery)

    //   if (user.rows.length < 1) {
    //     throw 'User does not exist'
    //   }
    //   return user.rows[0]
    // },
    // async getAllUsers(parent, _, { app, req, postgres }, info) {
    //   authenticate(app, req)
    //   const findUserQuery = {
    //     text: 'SELECT * FROM boilerplate.users',        
    //   }
    //   const user = await postgres.query(findUserQuery)

    //   if (user.rows.length < 1) {
    //     throw 'No users'
    //   }
    //   return user.rows
    // },
  },
}
