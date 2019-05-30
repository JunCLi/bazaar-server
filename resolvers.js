const queryResolvers = require('./resolvers/query/queryResolvers')
const userResolvers = require('./resolvers/query/userResolvers')
const itemResolvers = require('./resolvers/query/itemResolvers')
const mutationResolvers = require('./resolvers/mutation/mutationResolvers')

module.exports = () => {
  return {
    ...queryResolvers,
    ...mutationResolvers,
    ...userResolvers,
    ...itemResolvers
  }
}
