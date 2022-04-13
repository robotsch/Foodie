const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/01_user_queries");
const orderQueries = require("../db/queries/04_orders_queries");

// Handle order completion, WIP
router.post("/", (req, res) => {
  orderQueries
    .completeOrder(req.body.orderId)
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
});

module.exports = router;