const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");
const twilioClient = require("../lib/twilio");

router.post("/", (req, res) => {
  console.log(req.body)
});

module.exports = router;
