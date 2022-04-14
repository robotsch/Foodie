const express = require("express");
const router = express.Router();
const orderQueries = require("../db/queries/04_orders_queries");
const twilioClient = require("../lib/twilio");

/**
 * Handle incoming Twilio webhook triggered by incoming SMS from restaurant
 * Parses orderId and estimatedTime, and updates database with those values
 */

router.post("/", (req, res) => {
  const [orderId, estimatedTime] = req.body.Body.split(" ");
  if (Number(orderId) % 1 === 0 || Number(estimatedTime % 1 === 0)) {
    orderQueries.acceptOrder(Number(orderId), Number(estimatedTime));
    orderQueries.getOrderPhone(Number(orderId))
      .then((orderPhone) => {
        twilioClient.messages.create({
          body: `Your order from ${restaurant} has been confirmed! It will be ready for pickup in approximately ${estimatedTime} minutes`,
          from: process.env.APP_PHONE,
          to: orderPhone
        });
      })
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
