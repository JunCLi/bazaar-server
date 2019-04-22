exports.up = pgm => {
  //1. Users Table
  pgm.sql(`
    CREATE TABLE "bazaar"."users" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "status" VARCHAR(64),
      "date_created" DATE NOT NULL DEFAULT CURRENT_DATE,
      "fullname" VARCHAR(128),
      "username" VARCHAR(128)
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."items" (
      "id" SERIAL PRIMARY KEY,
      "item_name" VARCHAR(64) NOT NULL,
      "item_type" VARCHAR(64) NOT NULL,
      "item_status" VARCHAR(64) NOT NULL,
      "item_price" VARCHAR(64) NOT NULL,
      "item_inventory" VARCHAR(64) NOT NULL,
      "item_owner_id" INT NOT NULL
    );
  `)
  /* TODO: add more migrations */
};