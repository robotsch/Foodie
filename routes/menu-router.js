const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");

// GET request for /api/menu/ 

router.get("/", (req, res) => {
  // temp session for menu testing
  req.session.user_id = "1";

  // Queries for all menu items and all categories then sends JSON of all data
  return Promise.all([
    menuQueries.getAllMenuItems(),
    menuQueries.getAllCategories(),
  ])
    .then((values) => {
      const allMenuItems = values[0];
      const allCategories = values[1]
      
      // Takes all menuItem data and makes it object where key=category_id and
      // value=an array of menu items belonging to said category
      const menuItems = {};
      allMenuItems.forEach((menuItem) => {
        if (!(menuItem.category_id in menuItems)) {
          menuItems[menuItem.category_id] = [];
        }
        menuItems[menuItem.category_id].push(menuItem);
      });

      // Takes all category data and makes it object where key=category.id and 
      // value=category's name
      const categories = {};
      allCategories.forEach((category) => {
        categories[category.id] = category.category;
      });

      // Sends all data back as JSON object
      res.send(
        JSON.stringify({ menuItems: menuItems, categories: categories })
      );
    })
    .catch((err) => {
      res.status(500).send("Failed to get menu and items");
    });
});

module.exports = router;
