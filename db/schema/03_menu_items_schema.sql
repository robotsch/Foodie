DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(55) NOT NULL,
  price SMALLINT NOT NULL,
  description VARCHAR(255) NOT NULL DEFAULT 'A delicious item sure to suit your every need!',
  image_url VARCHAR(255) NOT NULL DEFAULT 'https://toppng.com/uploads/preview/clipart-free-seaweed-clipart-draw-food-placeholder-11562968708qhzooxrjly.png',
  category_id SMALLINT REFERENCES categories(id) ON DELETE RESTRICT

);
