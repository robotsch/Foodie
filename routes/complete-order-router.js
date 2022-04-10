/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

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
      return orderStr
    })
    .catch((err) => {
      res.send("Failed to get order items");
    });
});

module.exports = router;
