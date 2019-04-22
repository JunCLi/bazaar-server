const { gql } = require('apollo-server-express')

module.exports = gql`

  type Query {
    getAllUsers: [User],
    user(id : ID!): User,
    getAllItems: [Item],
    item(id : ID!): Item
  }

  type User {
    id: ID!,
    fullname: String
  }

  type Item {
    id: ID!,
    item_name: String,
    item_type: String,
    item_status: String,
    item_price: Float,
    item_inventory: Int
  }


  type Mutation {
    signUp(
      email: String!,
      password: String!
    ):SignupResponse!,

    login(
      email: String!,
      password: String!
    ):LoginResponse!

    registerItem(
      name: String!,
      type: String!,
      status: String!,
      price: Float!,
      inventory:  Int!
    ):RegisterItemResponse!

    removeItem(
      id: Int!
    ):RemoveItemResponse

    purchaseItem(
      id: Int!,
      status: String!,
      inventory: Int!
    ):PurchaseItemResponse
  }

  type SignupResponse {
    token: String,
    message: String!
  }

  type LoginResponse {
    token: String,
    message: String!,
  }

  type RegisterItemResponse {
    token: String,
    message: String!
  }

  type RemoveItemResponse {
    token: String,
    message: String!
  }

  type PurchaseItemResponse {
    token: String,
    message: String!
  }
`

