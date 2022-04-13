/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const menuQueries = require('../db/queries/03_menu_item_queries');

// GET request for /api/cart
router.get("/", (req, res) => {
  const orders = req.query; // sessionStorage.getItem("orders");
  const menuItemIDs = Object.keys(orders);

  // Sends empty obj if no items in orders
  if (menuItemIDs.length === 0) {
    return res.json({});
  }

  const orderSummary = {};
  const promises = [];

  menuItemIDs.forEach(id => {
    promises.push(menuQueries.getItemByID(id));
  });

  return Promise.all(promises)
    .then(menuItems => {
      menuItems.forEach(menuItem => {
        orderSummary[menuItem.id] = menuItem;
        orderSummary[menuItem.id]['quantity'] = parseInt(orders[menuItem.id]);
      });

      // Sends obj where key=menuItem id and value=menuItem obj with data from database and a quantity attibute
      res.json(orderSummary);
    })
    .catch(() => res.status(500).send('Failed to get items from cart'));

});

module.exports = router;