const bcrypt = require("bcryptjs");
const userQueries = require('../db/queries/01_user_queries');

/**
 * Creates a new user in the database with the provided info
 * @returns the newly created user's ID and sets the session
 */

const registerUser = function(userObj) {
  const userInfo = {
    email: userObj.email,
    pw: bcrypt.hashSync(userObj.password, 10),
    fname: userObj.firstName,
    lname: userObj.lastName,
    phone: userObj.phone
  };

  userQueries.addUser(userInfo)
    .then((newUser) => {
      return newUser.id;
    })
    .catch((err) => {
      console.log('Registration failed: ', err);
    });
};

module.exports = registerUser;