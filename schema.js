const { gql } = require('apollo-server-express')

module.exports = gql`

  type User {
    id: ID!,
    fullname: String
  }
  type Query {
    getAllUsers: [User],
    user(id : ID): User,
    test: String!
    #TODO 
  }
  type Test {
    name: String
  }
  # type Mutation {
  #   #TODO
  # }

`

