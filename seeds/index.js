const { Pool } = require('pg')
const squel = require('squel').useFlavour('postgres')
const config = require('../config/default.json')

const userSeeds = [
  {
    fullname: 'Simon Stern',
    email: 'simon@simon.stern',
    password: '123',
  },
  {
    fullname: 'Akshay Manchanda',
    email: 'akshay@akshay.com',
    password: '123',
  }
]

const seed = async () => {
  const pg = await new Pool(config.db).connect()

  try {
    await pg.query('BEGIN')

    console.log('Seeding Users...')

    await Promise.all(
      userSeeds.map(userSeed =>
        pg.query(
          squel
            .insert()
            .into('boiler.users')
            .setFields(userSeed)
            .toParam()
        )
      )
    )
  /* TODO more seeds, one for each table you need to seed */
    console.log('Seeding Users... [DONE]');
    await pg.query('COMMIT')
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
