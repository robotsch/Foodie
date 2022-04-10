const db = require("../db");

//gets all the items on our menu
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

//receives an order object containing menu_items(id):quantity (property:value). returns an integer representing the total cost of the order in cents
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

//receives an integer representing the menu_items(id). returns an object containing the row of the matching menu item from the menu_items table
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

exports.getItemByID = getItemByID;
