DROP TABLE IF EXISTS order_menu_items CASCADE;

CREATE TABLE order_menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  quantity SMALLINT NOT NULL

);
