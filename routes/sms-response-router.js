const express = require("express");
const router = express.Router();
const twilioClient = require("../lib/twilio");

router.post("/", (req, res) => {
  const [orderId, estimatedTime] = req.body.split(' ')
  console.log(orderId, estimatedTime)
});

module.exports = router;
