const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/01_user_queries');
const authUtils = require('../utils/auth-utils')

router.get("/", (req, res) => {
  console.log(req)
})

module.exports = router;