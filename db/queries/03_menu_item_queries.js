const db = require("../db");

const getAllMenuItems = () => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT *
  FROM menu_items
  `;

  return db.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllMenuItems = getAllMenuItems;
