const express = require('express');
const router  = express.Router();
const menuQueries = require('../db/queries/03_menu_item_queries')

router.get("/", (req, res) => {
  // temp session for menu testing
  req.session.user_id = 'test'
  return menuQueries.getAllMenuItems()
    .then((data) => {
      const menuItems = data.rows
      res.json(menuItems)
    })
    .catch((err) => {
      res.status(500).send('Failed to get menu items')
    })
});

module.exports = router