const express = require("express");
const router = express.Router();
const orderQueries = require("../db/queries/04_orders_queries");

// GET request for /api/orders-user-id
router.get("/", (req, res) => {
  const userID = req.session.user_id;
  // console.log("userID: ", userID);
  //console.log("req.session.user_id: ", req.session.user_id);
  return Promise.all([
    orderQueries.newOrdersByID(userID),
    orderQueries.oldOrdersByID(userID),
  ])
    .then((values) => {
      res.send(JSON.stringify({ newOrders: values[0], oldOrders: values[1] }));
    })
    .catch((err) => {
      res.status(500).send("Failed to get orders");
    });
});

module.exports = router;