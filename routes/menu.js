/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
//const menuQueries = require('../db/menu-queries')

module.exports = (db) => {
  router.get("/", (req, res) => {
    menuQueries.getMenuItems()
      .then((items) => {
        const menuItems = items.rows
        res.json(menuItems)
      })
      .catch((err) => {
        res.status(500).send('Failed to get menu items')
      })
  });

  // router.post("/", (req, res) => {
  
  // })
  return router;
};
