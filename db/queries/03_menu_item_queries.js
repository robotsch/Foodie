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

const sumOrderTotal = (order) => {
  const menuIDs = Object.keys(order);
  const quantity = Object.values(order);
  let total = 0;

  for (let i = 0; i < menuIDs.length; i++) {
    const menuObj = getItemByID(menuIDs[i]);
    total += menuObj.price * quantity[i];
  }
  return total;
};

exports.sumOrderTotal = sumOrderTotal;

const getItemByID = (menuID) => {
  // 1
  const queryParams = [menuID];
  // 2
  let queryString = `
  SELECT *
  FROM menu_items
  WHERE id = $1
  `;

  return db.query(queryString, queryParams).then((res) => res.rows[0]);
};
