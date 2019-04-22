const { gql } = require('apollo-server-express')

module.exports = gql`

  type Query {
    getAllUsers: [User],
    getUser(id : ID!): User,
    getAllItems: [Item],
    getItem(id : ID!): Item,
    getAllTransactions(user_id : ID!): [Transaction],
    getTransaction(id : ID!): Transaction
  }

  type User {
    id: ID,
    email: String,
    user_status: String,
    user_date_created: String,
    fullname: String,
    username: String
  }

  type Item {
    id: ID,
    item_owner_id: ID,
    item_name: String,
    item_type: String,
    item_status: String,
    item_price: Float,
    item_inventory: Int,
    date_added: String
  }

  type Transaction {
    id: ID,
    item_id: ID,
    purchased_by_id: ID,
    purchased_from_id: ID,
    status: String,
    date_of_purchase: String,
    purchase_price: Int,
    purchase_quantity: Int
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
      item_owner_id: ID!,
      item_name: String!,
      item_type: String!,
      item_price: Float!,
      item_inventory:  Int!
    ):RegisterItemResponse!

    purchaseItem(
      purchase_by_id: ID!,
      item_id: ID!,
      purchase_quantity: Int!
    ):PurchaseItemResponse!

    removeItem(
      id: ID!
    ):RemoveItemResponse!

    updateItem(
      id: ID!
    )
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

