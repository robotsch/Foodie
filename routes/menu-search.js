const express = require("express");
const router = express.Router();

const menuQueries = require("../db/queries/03_menu_item_queries");

routerpost("/search", (req, res) => {
  //console.log("post request: ", req);

  req.session.user_id = "test";

  let body = req.body;

  let searchArr = Object.keys(body);
  let searchString = searchArr[0];

  console.log("searchString: ", searchString);

  return Promise.all([
    menuQueries.getItemBySearch(searchString),
    menuQueries.getAllCategories(),
  ])
    .then((values) => {
      const menuItems = {};

      values[0].forEach((row) => {
        if (!(row.category_id in menuItems)) {
          menuItems[row.category_id] = [];
        }
        menuItems[row.category_id].push(row);
      });

      const categories = {};
      values[1].forEach((row) => {
        categories[row.id] = row.category;
      });
      //console.log(menuItems, categories);
      res.send(
        JSON.stringify({ menuItems: menuItems, categories: categories })
      );
    })
    .catch((err) => {
      res.status(500).send("Failed to get menu and items");
    });
});

module.exports = router;
