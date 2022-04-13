const bcrypt = require("bcryptjs");
const userQueries = require('../db/queries/01_user_queries');

/**
 * Creates a new user in the database with the provided info
 * @returns the newly created user's ID and sets the session
 */

const registerUser = function(userObj) {
  return userQueries.addUser({
    email: userObj.email,
    password:  bcrypt.hashSync(userObj.password, 10),
    first_name: userObj.fname,
    last_name: userObj.lname,
    phone_number: userObj.phone
  })
    .then((newUser) => {
      return newUser.id;
    })
    .catch((err) => {
      console.log('Registration failed: ', err);
    });
};

const authenticateUser = function(credentials) {
  return userQueries.getUserWithEmail(credentials.email)
    .then((user) => {
      if(user) {
        if(bcrypt.compareSync(credentials.password, user.password)) {
          return user.id
        }
      }
    })
}

module.exports = {
  registerUser,
  authenticateUser
};