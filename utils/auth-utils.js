const bcrypt = require("bcryptjs");
const userQueries = require('../db/queries/01_user_queries');

/**
 * Takes a password string
 * @returns the string if it passes checks, otherwise returns null
 */
const validatePassword = function (password) {
  const checks = {
    capital: /[A-Z]/,
    numbers: /[0-9]/,
    special: /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
  };
  if (password.length < 8 ||
    !checks.capital.test(password) ||
    !checks.numbers.test(password) ||
    !checks.special.test(password)
  ) {
    return null;
  }
  return password;
};

/**
 * Takes a user data object andcreates a new user in the database
 * @returns the newly created user's ID and sets the session
 */
const registerUser = function (userObj) {
  return userQueries.addUser({
    email: userObj.email,
    password: bcrypt.hashSync(userObj.password1, 10),
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

/**
 * Authenticates a user against an existing user in the database
 * @returns the matching user's userId
 */
const authenticateUser = function (credentials) {
  return userQueries.getUserWithEmail(credentials.email)
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(credentials.password, user.password)) {
          return user.id;
        }
      }
    });
};

module.exports = {
  registerUser,
  authenticateUser,
  validatePassword
};