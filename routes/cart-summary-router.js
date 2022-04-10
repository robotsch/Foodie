/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const menuQueries = require('../db/queries/03_menu_item_queries');

router.get("/", (req, res) => {
  const order = req.session.order;
  if (order) {
    menuQueries.sumOrderTotal(order)
      .then((data) => {
        res.json(data.row[0])
      })
      .catch((err) => {
        res.status(500).send('Failed to get cart');
      });
  }
});

module.exports = router;