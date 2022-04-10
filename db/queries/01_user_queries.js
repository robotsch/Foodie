const db = require("../db");

const getUserWithEmail = function (email) {
  const values = [`%${email}%`];

  return db
    .query(`SELECT * FROM users WHERE email LIKE $1`, values)
    .then((result) => {
      console.log("result: ", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function (id) {
  return db
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      console.log("result: ", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;

const addUser = function (user) {
  const email = user.email;
  const pw = user.password;
  const fname = user.first_name;
  const lname = user.last_name;
  const phone = user.phone_number;
  const values = [email, pw, fname, lname, phone];

  return db
    .query(
      `INSERT INTO users (email, password, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      values
    )
    .then((result) => {
      console.log("result: ", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;
