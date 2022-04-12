const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/01_user_queries');
const authUtils = require('../utils/auth-utils')

/**
 * Route to handle registration requests
 * Checks if an email exists - if not,
 *  attempt to register the user in the database.
 *  If this is successful, set the user's session to the created user
 * Otherwise, send a relevant error message 
 */

router.get("/", (req, res) => {
  // TODO: integration testing when registration page exists
  // const userData = req.body
  const userData = {
    email: 'testemail6@test.com',
    password: 'secret',
    fname: 'christian',
    lname: 'humble',
    phone: '+11234567890'
  }

  userQueries.getUserWithEmail(userData.email)
    .then((result) => {
      if(!result) {
        authUtils.registerUser(userData)
          .then((newUserId) => {
            if(newUserId) {
              req.session.user_id = newUserId
            } else {
              res.send('Registration failed')
            }
          })
          .catch((err) => console.log(err))
      } else {
        res.send('Email already exists')
      }
    })
    .catch((err) => console.log(err))
})

module.exports = router;