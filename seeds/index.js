const { Pool } = require('pg')
const squel = require('squel').useFlavour('postgres')
const config = require('../config/default.json')

const userSeeds = [
  {
    fullname: 'Simon Stern',
    email: 'simon@simon.stern',
    password: '123',
    user_status: 'active'
  },
  {
    fullname: 'Akshay Manchanda',
    email: 'akshay@akshay.com',
    password: '123',
    user_status: 'active'
  },
  {
    fullname: 'Alam Talash',
    email: 'alam@alam.com',
    password: '145',
    user_status: 'active'
  }
]

const itemsSeeds = [
  {
    item_name: 'Banana',
    item_type: 'an item',
    item_status: 'listed',
    item_price: 314,
    item_inventory: 10,
    item_owner_id: 1
  },
  {
    item_name: 'Apple',
    item_type: 'an item',
    item_status: 'listed',
    item_price: 234,
    item_inventory: 7,
    item_owner_id: 1
  },
  {
    item_name: 'Banana',
    item_type: 'an item',
    item_status: 'listed',
    item_price: 318,
    item_inventory: 3,
    item_owner_id: 2
  },
  {
    item_name: 'Phone',
    item_type: 'an item',
    item_status: 'listed',
    item_price: 543198,
    item_inventory: 1,
    item_owner_id: 3
  },
  {
    item_name: 'Not a phone',
    item_type: 'Not an item',
    item_status: 'listed',
    item_price: 0,
    item_inventory: 2,
    item_owner_id: 2
  },
]

const transactionsSeeds = [
  {
    item_id: 5,
    sens_transaction_id: 1,
    purchased_by_id: 1,
    purchased_from_id: 2,
    status: 'completed',
    purchase_price: 0,
    purchase_quantity: 1
  },
  {
    item_id: 1,
    sens_transaction_id: 2,
    purchased_by_id: 3,
    purchased_from_id: 1,
    status: 'completed',
    purchase_price: 234,
    purchase_quantity: 3
  },
]

const sensTransactionsSeeds = [
  {
    stripe_id: 10
  },
  {
    stripe_id: 11
  },
]

const seed = async () => {
  const pg = await new Pool(config.db).connect()

  try {
    await pg.query('BEGIN')

    console.log('Seeding Users...')

    await Promise.all([
      userSeeds.map(userSeed => pg.query(
        squel
          .insert()
          .into('bazaar.users')
          .setFields(userSeed)
          .toParam()
      )),
      itemsSeeds.map(itemSeed => pg.query(
        squel
          .insert()
          .into('bazaar.items')
          .setFields(itemSeed)
          .toParam()
      )),
      sensTransactionsSeeds.map(sensTransactionSeed => pg.query(
        squel
          .insert()
          .into('bazaar.sens_transactions')
          .setFields(sensTransactionSeed)
          .toParam()
      )),
      transactionsSeeds.map(transactionSeed => pg.query(
        squel
          .insert()
          .into('bazaar.transactions')
          .setFields(transactionSeed)
          .toParam()
      ))
    ])
    await pg.query('COMMIT')
    console.log('Seeding Users... [DONE]');
  } catch (e) {
    await pg.query('ROLLBACK')
    throw e
  } finally {
    pg.release()
  }
}

seed().catch(e => {
  setImmediate(() => {
    throw e
  })
})
