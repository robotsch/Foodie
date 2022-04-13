const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");
const orderQueries = require("../db/queries/04_orders_queries");
const twilioClient = require("../lib/twilio");

/**
 * Called when a user completes their order
 * Creates a new order entry to the database
 * Using that newly created order ID,
 *  send an SMS to the restaurant phone number
 * SMS includes order ID and the customer's order
 *  alongside a prompt to respond with estimated completion time
*/
router.get("/", (req, res) => {

  const promises = [];
  const user = { name: "testuser", id: 1 };

  const order = req.query;
  let orderStr = `Order received from ${user.name}\n`;

  Object.keys(order).forEach((id) => {
    promises.push(menuQueries.getItemByID(id));
  });

  Promise.all(promises)
    .then((data) => {
      for (foodItem of data) {
        orderStr += `${foodItem.name} x${order[foodItem.id]}\n`;
      }

      orderQueries.createNewOrder(user.id, order)
        .then((createdOrder) => {
          orderStr += `Order ID: ${createdOrder.id}\n`;
          orderStr +=
            "Please respond with the order id followed by estimated completion time in minutes.";
          twilioClient.messages
            .create({
              body: orderStr,
              from: process.env.APP_PHONE,
              to: process.env.RESTAURANT_PHONE,
            })
            .catch((err) => console.log(err.messages));
          console.log(createdOrder.id);
          res.send(`${createdOrder.id}`);
        })
    })
    .catch((err) => {
      res.send("Failed to get order items");
    });
});

module.exports = router;
