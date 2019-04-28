const queryResolvers = require('./resolvers/query/queryResolvers')
const mutationResolvers = require('./resolvers/mutation/mutationResolvers')
const userResolvers = require('./resolvers/query/userResolvers')

module.exports = () => {
  return {
    ...queryResolvers,
    ...mutationResolvers,
    ...userResolvers
  }
}
