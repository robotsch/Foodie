const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");
const userQueries = require("../db/queries/01_user_queries");
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
  promises.push(userQueries.getUserWithId(req.session.user_id));

  const order = req.query;
  
  Object.keys(order).forEach((id) => {
    promises.push(menuQueries.getItemByID(id));
  });

  Promise.all(promises)
    .then((data) => {
      // Promise array mutation intended
      const user = data.shift();
      let orderStr = `Order received from ${user.first_name} ${user.last_name.charAt(0)}.\n`;
      for (const foodItem of data) {
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
            
          res.send(`${createdOrder.id}`);
        });
    })
    .catch(() => {
      res.status(500).send("Failed to get order items: ", err);
    });
});

module.exports = router;
