/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
//const menuQueries = require('../db/menu-queries')

router.get("/", (req, res) => {
  // temp session for menu testing
  req.session.user_id = 'test'
  // menuQueries.getMenuItems()
  //   .then((data) => {
  //     const menuItems = items.rows
  //     res.json(menuItems)
  //   })
  //   .catch((err) => {
  //     res.status(500).send('Failed to get menu items')
  //   })
  res.send('Hello')
});

module.exports = router