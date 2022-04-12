const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/01_user_queries');
const authUtils = require('../utils/auth-utils')

/**
 * Route to handle login requests
 * Checks if an email exists - if not,
 *  attempt to register the user in the database.
 *  If this is successful, set the user's session to the created user
 * Otherwise, send a relevant error message 
 */

router.get("/", (req, res) => {
  // TODO: integration testing when registration page exists
  // const userData = req.body
  const userData = {
    email: 'testemail5@test.com',
    password: 'secret'
  }

  userQueries.getUserWithEmail(userData.email)
    .then((result) => {
      if(result) {
        console.log(result)
        authUtils.authenticateUser(userData)
          .then((userId) => {
            if(userId) {
              req.session.user_id = userId
              console.log(req.session)
            } else {
              res.send('Incorrect email or password')
            }
          })
          .catch((err) => console.log(err))
      } else {
        res.send('Incorrect email or password')
      }
    })
    .catch((err) => console.log(err))
})

module.exports = router;