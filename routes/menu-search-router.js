const express = require("express");
const router = express.Router();
const menuQueries = require("../db/queries/03_menu_item_queries");

// GET request to /api/menu-search
router.get("/", (req, res) => {
  //console.log("post request: ", req);

  // req.session.user_id = "test";

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

