const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");

/**
 * Query the database based on the search parameters
 *  then returns the results to the client
 */
router.get("/", (req, res) => {

  const searchArr = Object.keys(req.query);
  const searchString = searchArr[0];

  return menuQueries.getItemBySearch(searchString)
    .then((results) => {
      res.send(JSON.stringify({menuItemResults: results}));
    })
    .catch(() => {
      res.status(500).send("Failed to get menu and items");
    });
});

module.exports = router;

