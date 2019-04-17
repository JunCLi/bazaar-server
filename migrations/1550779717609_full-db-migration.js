exports.up = pgm => {
  //1. Users Table
  pgm.sql(`
    CREATE TABLE "bazaar"."users" (
      "id" SERIAL PRIMARY KEY,
      "fullname" TEXT NOT NULL
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."items" (
      "id" SERIAL PRIMARY KEY,
      "item_name" TEXT NOT NULL
    );
  `)
  /* TODO: add more migrations */
};