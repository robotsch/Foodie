const res = require("express/lib/response");
const db = require("../db");

//requires menuData in the same form as the data supplied to the sumOrderTotal function
const createNewOrderMenuItems = (orderData, menuData) => {
  const menuIDs = Object.keys(menuData);
  const quantity = Object.values(menuData);

  const orderID = orderData.id;

  for (let i = 0; i < menuIDs.length; i++) {
    const values = [menuIDs[i], orderID, quantity[i]];
    db.query(
      `INSERT INTO order_menu_items (menu_item_id, order_id, quantity) VALUES ($1, $2, $3);`,
      values
    )
      .then((result) => {
        console.log("inserted order_menu_items data");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

//Expects an userID INT. creates a new row in the orders and order_menu_items tables. returns the newly created order
//Expects menuData in the same form as the data supplied to the sumOrderTotal function
const createNewOrder = function (userID, menuData) {
  return db
    .query(`INSERT INTO orders (user_id) VALUES ($1) RETURNING *;`, [userID])
    .then((result) => {
      createNewOrderMenuItems(result.rows[0], menuData);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.createNewOrder = createNewOrder;

//receives an orderID and estTime (INT)
//updates the corresponding order with estimated completion time and time accepted
const acceptOrder = function (orderID, estTime) {
  const values = [estTime, orderID];

  db.query(
    `UPDATE orders
    SET time_accepted = LOCALTIMESTAMP, estimated_completion_time = $1
    WHERE id = $2;`,
    values
  )
    .then((result) => {
      console.log("Order accepted!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.acceptOrder = acceptOrder;

//receives an orderID as an INT and updates the orders table to mark order as complete
const completeOrder = function (orderID) {
  db.query(
    `UPDATE orders
    SET active_order = FALSE
    WHERE id = $1;`,
    [orderID]
  )
    .then((result) => {
      console.log("Order completed!");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.completeOrder = completeOrder;

const newOrdersByID = function (userID) {
  //console.log("new: ", userID);

  const values = [userID];

  let queryString = `
  SELECT user_id, orders.id as orders_id, order_menu_items.id as order_menu_items_id, menu_items.id as menu_items_id, price, estimated_completion_time, time_ordered, time_accepted, name, quantity
    FROM orders
    JOIN order_menu_items ON order_id = orders.id
    JOIN menu_items ON menu_item_id = menu_items.id
    WHERE user_id = $1 AND active_order = TRUE;
  `;

  return db.query(queryString, values).then((res) => res.rows);
};

exports.newOrdersByID = newOrdersByID;

const oldOrdersByID = function (userID) {
  const values = [userID];

  let queryString = `
  SELECT user_id, orders.id as orders_id, order_menu_items.id as order_menu_items_id, menu_items.id as menu_items_id, price, estimated_completion_time, time_ordered, time_accepted, name, quantity
    FROM orders
    JOIN order_menu_items ON order_id = orders.id
    JOIN menu_items ON menu_item_id = menu_items.id
    WHERE user_id = $1 AND active_order = FALSE;
  `;

  return db.query(queryString, values).then((res) => res.rows);
};

exports.oldOrdersByID = oldOrdersByID;

const getEstimatedCompletionTime = function (orderID) {
  return db
    .query(
      `SELECT estimated_completion_time
    FROM orders
    WHERE id = $1`,
      [orderID]
    )
    .then((result) => result.rows[0]);
};

exports.getEstimatedCompletionTime = getEstimatedCompletionTime;

//takes orderID and userID to query the db for results and returns the order that matches. returns null/undefined if order/user does not exist or if the order does not belong to that user
const orderBelongsToUser = (orderID, userID) => {
  const values = [orderID, userID];

  return db
    .query(
      `SELECT *
    FROM orders
    JOIN users ON users.id = user_id
    WHERE orders.id = $1 AND users.id = $2`,
      [values]
    )
    .then((result) => result.rows[0]);
};

exports.orderBelongsToUser = orderBelongsToUser;
