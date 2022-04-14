const express = require("express");
const router = express.Router();
const orderQueries = require("../db/queries/04_orders_queries");

/**
 * Query the database for old/new orders for a given user
 *  then sends the data as a formatted response to the client
 */
router.get("/", (req, res) => {
  const userID = req.session.user_id;

  return Promise.all([
    orderQueries.newOrdersByID(userID),
    orderQueries.oldOrdersByID(userID),
  ])
    .then((values) => {
      res.send(JSON.stringify({ newOrders: values[0], oldOrders: values[1] }));
    })
    .catch(() => {
      res.send('Failed to get order history');
    });
});

module.exports = router;