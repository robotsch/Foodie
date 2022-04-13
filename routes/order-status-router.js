const express = require("express");
const router = express.Router();
const orderQueries = require("../db/queries/04_orders_queries");

// GET request for /api/order-status/ 
router.get("/", (req, res) => {
  // Queries for the estimated completion time which acts
  // as pending state if it's null
  orderQueries
    .getEstimatedCompletionTime(req.query.orderID)
    .then((result) => {
      res.send(`${result.estimated_completion_time}`);
    })
    .catch((err) => console.log(err.messages));
});

module.exports = router;
