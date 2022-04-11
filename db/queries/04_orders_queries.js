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

//Expects an orderData object containing property values for user_id, time_ordered. creates a new row in the orders and order_menu_items tables. returns the newly created order
//Expects menuData in the same form as the data supplied to the sumOrderTotal function
const createNewOrder = function (orderData, menuData) {
  const user = orderData.user_id;
  const time_ordered = orderData.time_ordered;
  const values = [user, time_ordered];

  return db
    .query(
      `INSERT INTO orders (user_id, time_ordered) VALUES ($1, $2) RETURNING *;`,
      values
    )
    .then((result) => {
      createNewOrderMenuItems(result.row[0], menuData);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.createNewOrder = createNewOrder;

//receives an orderInProgress object which should contain 2 properties: id (INT) and estimated_completion_time (INT)
//updates the corresponding order with estimated completion time and time accepted
const acceptOrder = function (orderInProgress) {
  const values = [
    orderInProgress.estimated_completion_time,
    orderInProgress.id,
  ];

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
