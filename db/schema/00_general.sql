-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_menu_items CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(55) NOT NULL
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(55) NOT NULL,
  price SMALLINT NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT 'A delicious item sure to suit your every need!',
  image_url VARCHAR(255) NOT NULL DEFAULT 'https://toppng.com/uploads/preview/clipart-free-seaweed-clipart-draw-food-placeholder-11562968708qhzooxrjly.png',
  category_id SMALLINT REFERENCES categories(id) ON DELETE RESTRICT

);



CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  estimated_completion_time INTEGER,
  time_ordered TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  time_accepted TIMESTAMP,
  active_order BOOLEAN DEFAULT TRUE
);

CREATE TABLE order_menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  quantity SMALLINT NOT NULL

);


CREATE TABLE user_sessions (
  sid varchar NOT NULL COLLATE default,
        sess json NOT NULL,
        expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IDX_session_expire ON session (expire);
