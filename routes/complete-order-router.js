const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");
const userQueries = require("../db/queries/01_user_queries")
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

// GET request for /api/checkout
// NOTE: tried to change to a post request but then on the 
//       orders page, it wouldn't render the order using
//       a post request, so leave as get for now
router.get("/", (req, res) => {

  const promises = [];
  promises.push(userQueries.getUserWithId(req.session.user_id))

  const order = req.query;
  
  Object.keys(order).forEach((id) => {
    promises.push(menuQueries.getItemByID(id));
  });

  Promise.all(promises)
    .then((data) => {
      // Constructs order string to be sent via text to restaurant
      const user = data.shift()
      let orderStr = `Order received from ${user.first_name} ${user.last_name.charAt(0)}.\n`;
      for (foodItem of data) {
        orderStr += `${foodItem.name} x${order[foodItem.id]}\n`;
      }

      // Creates new order and inserts into database
      orderQueries.createNewOrder(user.id, order)
        .then((createdOrder) => {
          orderStr += `Order ID: ${createdOrder.id}\n`;
          orderStr +=
            "Please respond with the order id followed by estimated completion time in minutes.";

          // Twilio sends text message to restaurant
          twilioClient.messages
            .create({
              body: orderStr,
              from: process.env.APP_PHONE,
              to: process.env.RESTAURANT_PHONE,
            })
            .catch((err) => console.log(err.messages));

          // Sends the newly created order's id as response
          res.send(`${createdOrder.id}`);
        });
    })
    .catch((err) => {
      res.send("Failed to get order items");
    });
});

module.exports = router;
