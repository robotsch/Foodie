const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");
const twilioClient = require("../lib/twilio");

router.get("/", (req, res) => {
  const promises = []
  const user = { name: "testuser" };

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
      orderStr += 'Please respond with the customer name and estimated time in minutes.'
      twilioClient.messages
        .create({body: orderStr, from: process.env.APP_PHONE, to: process.env.RESTAURANT_PHONE})
        .then(message => console.log(message))
    })
    .catch((err) => {
      res.send("Failed to get order items");
    });
});

module.exports = router;
