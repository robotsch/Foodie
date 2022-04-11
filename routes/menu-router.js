const express = require('express');
const router = express.Router();
const menuQueries = require('../db/queries/03_menu_item_queries');

router.get("/", (req, res) => {
  // temp session for menu testing
  req.session.user_id = 'test';

  return Promise.all([menuQueries.getAllMenuItems(), menuQueries.getAllCategories()])
    .then((values) => {

      const menuItems = {};

      values[0].forEach(row => {
        if (!(row.category_id in menuItems)) {
          menuItems[row.category_id] = [];
        }
        menuItems[row.category_id].push(row);
      });

      const categories = {};
      values[1].forEach(row => {
        categories[row.id] = row.category;
      });
      res.send(JSON.stringify({ menuItems: menuItems, categories: categories }));

    })
    .catch((err) => {
      res.status(500).send('Failed to get menu and items');
    });
});

module.exports = router;