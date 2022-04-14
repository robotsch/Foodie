const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");

/**
 * Queries the database for all menu items and categories
 *  then sends a formatted object back to the client
 */

router.get("/", (req, res) => {
  return Promise.all([
    menuQueries.getAllMenuItems(),
    menuQueries.getAllCategories(),
  ])
    .then((values) => {
      const allMenuItems = values[0];
      const allCategories = values[1];
      
      const menuItems = {};
      allMenuItems.forEach((menuItem) => {
        if (!(menuItem.category_id in menuItems)) {
          menuItems[menuItem.category_id] = [];
        }
        menuItems[menuItem.category_id].push(menuItem);
      });

      const categories = {};
      allCategories.forEach((category) => {
        categories[category.id] = category.category;
      });

      res.send(
        JSON.stringify({ menuItems: menuItems, categories: categories })
      );
    })
    .catch((err) => {
      res.status(500).send("Failed to get menu and items: ", err);
    });
});

module.exports = router;
