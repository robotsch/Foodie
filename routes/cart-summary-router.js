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
  const order = req.session.order;
  console.log(order);

  if (order) {

    const orderSummary = {};
    const promises = [];

    // promises.push(
    //   menuQueries.sumOrderTotal(order)
    //     .then((data) => {
    //       console.log(data);
    //       res.json(data);
    //     })
    //     .catch((err) => {
    //       res.status(500).send('Failed to get cart');
    //     })
    // );


    return Promise.all(promises)
    .then()
    .catch(err => {
      res.status(500).send('Failed to get cart');
    });

  } else {
    // Cart is empty
    return new Promise((resolve, reject) => {
      resolve({ [-1]: 0 });
    }).then(result => res.json(result));
  }
});

module.exports = router;