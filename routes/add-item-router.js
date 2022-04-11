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
  const itemId = req.query.itemId;
  return menuQueries.getItemByID(itemId)
    .then((data) => {
      const menuItem = data;
      res.json(menuItem);
    })
    .catch((err) => {
      res.status(500).send('Failed to get menu item');
    });
});

router.post("/", (req, res) => {
  const itemId = req.body.itemId;
  const itemQuantity = req.body.quantity;
  menuQueries.getItemByID(itemId)
    .then((menuItem) => {
      res.json({ [menuItem.id]: itemQuantity });
    })
    .catch(err => console.log(err.message));
});

module.exports = router;
