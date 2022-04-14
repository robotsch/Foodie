const express = require('express');
const router = express.Router();
const menuQueries = require('../db/queries/03_menu_item_queries');

/**
 * Grab order items from session and query the database for their info
 *  then send a formatted summary to be rendered by the client
 */

router.get("/", (req, res) => {
  const orders = req.query;
  const menuItemIDs = Object.keys(orders);
  
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

      res.json(orderSummary);
    })
    .catch(() => res.status(500).send('Failed to get items from cart'));

});

module.exports = router;