const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/01_user_queries");
const orderQueries = require("../db/queries/04_orders_queries");

// Manual order completion route
router.post("/", (req, res) => {
  orderQueries.completeOrder(Number(req.body.orderId));
  res.send("success");
});

module.exports = router;
