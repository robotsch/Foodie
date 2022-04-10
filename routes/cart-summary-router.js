/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const menuQueries = require('../db/menu-queries')

router.get("/", (req, res) => {
  const order = req.session.order
  const serviceFee = 100
  if(order) {

    

    menuQueries.sumOrderTotal(order)
    .then((data) => {
      const subtotal = data.rows[0]
      const tax = subtotal * 0.13
      const total = subtotal + serviceFee + tax
      res.json({ "Subtotal": subtotal, "Service Fee": serviceFee, "Tax": tax, "Total": total})
    })
    .catch((err) => {
      res.status(500).send('Failed to get cart')
    })
  }
  res.send('Hello')
});

module.exports = router