const express = require('express');
const router = express.Router();
const orderQueries = require('../db/queries/04_orders_queries')

/**
 * Query the database for an order's details
 *  then send a formatted object to the client
 */
router.get("/", (req, res) => {
  const orderId = req.body.orderID
  let modalObj = {}

  orderQueries.getAllOrderDetailsById(orderId)
    .then((data) => {
      for(const row in data) {
        modalObj[data[row].name] = {
          price: data[row].price,
          quantity: data[row].quantity
        }
      }
      res.send(JSON.stringify(modalObj))
    })
});

module.exports = router;