const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");
const orderQueries = require("../db/queries/04_orders_queries")
const twilioClient = require("../lib/twilio");

router.get("/", (req, res) => {
  const promises = []
  const user = { name: "testuser", id: 1};

  const order = { 1: 3, 3: 1};
  let orderStr = `Order received from ${user.name}\n`;

  Object.keys(order).forEach((id) => {
    promises.push(menuQueries.getItemByID(id))
  })

  Promise.all(promises)
    .then((data) => {
      for(foodItem of data) {
        orderStr += `${foodItem.name} x${order[foodItem.id]}\n`;
      }
      const orderId = orderQueries.createNewOrder(user.id, order).id
      orderStr += `Order ID: ${orderId}\n`
      orderStr += 'Please respond with the order id followed by estimated completion time in minutes.'
      twilioClient.messages
        .create({body: orderStr, from: process.env.APP_PHONE, to: process.env.RESTAURANT_PHONE})
        .then((messages) => {
          console.log(messages)
        })
    })
    .catch((err) => {
      res.send("Failed to get order items");
    });
});

module.exports = router;
