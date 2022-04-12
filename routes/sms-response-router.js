const express = require("express");
const router = express.Router();
const orderQueries = require("../db/queries/04_orders_queries");
const twilioClient = require("../lib/twilio");

router.post("/", (req, res) => {
  const [orderId, estimatedTime] = req.body.Body.split(" ");
  console.log();
  if (Number(orderId) % 1 === 0 || Number(estimatedTime % 1 === 0)) {
    orderQueries.acceptOrder(Number(orderId), Number(estimatedTime));
    return res.send("Success");
  }
  twilioClient.messages
    .create({
      body: "Please respond with the order number followed by estimated time in minutes",
      from: process.env.APP_PHONE,
      to: process.env.RESTAURANT_PHONE,
    })
    .then((messages) => {
      console.log(messages);
    });
});

module.exports = router;