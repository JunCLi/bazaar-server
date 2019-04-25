exports.up = pgm => {
  //1. Users Table
  pgm.sql(`
    CREATE TABLE "bazaar"."users" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL,
      "password" VARCHAR(255) NOT NULL,
      "user_status" VARCHAR(64),
      "user_date_created" DATE NOT NULL DEFAULT CURRENT_DATE,
      "fullname" VARCHAR(128)
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."items" (
      "id" SERIAL PRIMARY KEY,
      "item_owner_id" INT NOT NULL,
      "item_name" VARCHAR(64) NOT NULL,
      "item_type" VARCHAR(64) NOT NULL,
      "item_status" VARCHAR(64) NOT NULL,
      "item_price" INT NOT NULL,
      "item_inventory" VARCHAR(64) NOT NULL,
      "item_description" TEXT,
      "date_added" DATE NOT NULL DEFAULT CURRENT_DATE,
      FOREIGN KEY (item_owner_id) REFERENCES bazaar.users (id)
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."item_ratings" (
      "id" SERIAL PRIMARY KEY,
      "item_id" INT NOT NULL,
      "value" INT NOT NULL
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."user_ratings" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INT NOT NULL,
      "value" INT NOT NULL
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."sens_transactions" (
      "id" SERIAL PRIMARY KEY,
      "stripe_id" INT NOT NULL
    );
  `),

  pgm.sql(`
    CREATE TABLE "bazaar"."transactions" (
      "id" SERIAL PRIMARY KEY,
      "item_id" INT NOT NULL,
      "sens_transaction_id" INT NOT NULL,
      "purchased_by_id" INT NOT NULL,
      "purchased_from_id" INT NOT NULL,
      "status" VARCHAR(64) NOT NULL,
      "date_of_purchase" DATE NOT NULL DEFAULT CURRENT_DATE,
      "purchase_price" INT NOT NULL,
      "purchase_quantity" INT NOT NULL,
      FOREIGN KEY (item_id) REFERENCES bazaar.items (id),
      FOREIGN KEY (sens_transaction_id) REFERENCES bazaar.sens_transactions (id),
      FOREIGN KEY (purchased_by_id) REFERENCES bazaar.users (id),
      FOREIGN KEY (purchased_from_id) REFERENCES bazaar.users (id)
    );
  `)
};