const { gql } = require('apollo-server-express')

module.exports = gql`

  type Query {
    getAllUsers: [User],
    getUser(id : ID): User,
    getLoggedUser: User,
    getAllItems: [Item],
    getItem(id : ID!): Item,
    getAllTransactions(user_id : ID!): [Transaction],
    getTransaction(id : ID!): Transaction
  }

  type User {
    id: ID,
    user_rating_id: ID,
    email: String,
    user_status: String,
    user_date_created: String,
    fullname: String,
    usersItems: [Item]
  }

  type Item {
    id: ID,
    item_rating_id: ID,
    item_owner_id: ID,
    item_name: String,
    item_type: String,
    item_status: String,
    item_price: Int,
    item_inventory: Int,
    item_description: String,
    date_added: String,
    itemOwner: User
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
      input: SignUpObject!
    ):PlaceholderResponse!

    login(
      input: LogInObject!
    ):PlaceholderResponse!
    
    logout(
      email: String!
    ):PlaceholderResponse

    updateUser(
      input: UpdateUserObject!
    ):PlaceholderResponse!

    registerItem(
      input: RegisterItemObject!
    ):PlaceholderResponse!

    purchaseItem(
      purchase_by_id: ID!,
      item_id: ID!,
      purchase_quantity: Int!
    ):PlaceholderResponse!

    removeItem(
      item_id: ID!
    ):PlaceholderResponse!

    updateItem(
      input: UpdateItemObject!
    ):PlaceholderResponse!

    addUserRating(
      input: addUserRatingObject!
    ):PlaceholderResponse!

    addItemRating(
      input: addItemRatingObject!
    ):PlaceholderResponse!
  }

  type PlaceholderResponse {
    token: String,
    message: String!
  }

  input SignUpObject {
    email: String!,
    fullname: String!,
    password: String!
  }

  input LogInObject {
    email: String!,
    password: String!
  }

  input UpdateUserObject {
    id: ID,
    email: String,
    user_status: String,
    user_date_created: String,
    fullname: String
  }

  input RegisterItemObject {
    item_owner_id: ID!,
    item_name: String!,
    item_type: String,
    item_status: String!,
    item_price: Float!,
    item_inventory: Int!,
    item_description: String
  }

  input UpdateItemObject {
    id: ID!,
    item_owner_id: ID!,
    item_name: String!,
    item_type: String!,
    item_status: String!,
    item_price: Int,
    item_inventory: Int,
    date_added: String
  }

  input addUserRatingObject {
    ratee_id: ID!,
    rated_user_id: ID!,
    rating: Int
  }

  input addItemRatingObject {
    ratee_id: ID!,
    rated_item_id: ID!,
    rating: Int
  }
`

