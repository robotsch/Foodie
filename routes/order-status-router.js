const express = require("express");
const router = express.Router();
const orderQueries = require("../db/queries/04_orders_queries");

/**
 * Queries the database for the estimated completion time of an order
 *  then updates the client based on the result
 * Downstream: Null results will display 'Pending'
 *  otherwise the client will render the retrieved time
 */
router.get("/", (req, res) => {
  orderQueries
    .getEstimatedCompletionTime(req.query.orderID)
    .then((result) => {
      res.send(`${result.estimated_completion_time}`);
    })
    .catch((err) => console.log(err.messages));
});

module.exports = router;
