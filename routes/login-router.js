const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/01_user_queries');
const authUtils = require('../utils/auth-utils');

/**
 * Route to handle login requests
 * Checks if an email exists - if not,
 *  attempt to register the user in the database.
 *  If this is successful, set the user's session to the created user
 * Otherwise, send a relevant error message
 */

/* eslint-disable camelcase */
// Stop eslint from complaining about our session property

router.post("/", (req, res) => {
  const userData = req.body;

  userQueries.getUserWithEmail(userData.email)
    .then((result) => {
      if (result) {
        authUtils.authenticateUser(userData)
          .then((userId) => {
            if (userId) {
              req.session.user_id = userId;
              res.redirect("/");
            } else {
              res.send('Incorrect email or password');
            }
          })
          .catch((err) => console.log(err));
      } else {
        res.send('Incorrect email or password');
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;