const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");

/**
 * Router to send search results back to the client
 * Executes a database query based on the search parameters
 */
router.get("/", (req, res) => {

  const searchArr = Object.keys(req.query);
  const searchString = searchArr[0];

  return menuQueries.getItemBySearch(searchString)
    .then((results) => {
      // Sends array of results in JSON obj where key is menuItemResults
      res.send(JSON.stringify({menuItemResults: results}));
    })
    .catch(() => {
      res.status(500).send("Failed to get menu and items");
    });
});

module.exports = router;

