const db = require("../db");

//gets all the items on our menu and returns it as an array of objects
const getAllMenuItems = () => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT *
  FROM menu_items
  ORDER BY category_id;
  `;

  return db.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllMenuItems = getAllMenuItems;

//gets all categories from database and returns as obj of key=id, value=name
const getAllCategories = () => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT *
  FROM categories
  ORDER BY categories.id;
  `;

  return db.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllCategories = getAllCategories;

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

const getItemBySearch = (searchItem) => {
  const values = [`%${searchItem}%`];
  let queryString = `
   SELECT *
   FROM menu_items
   WHERE lower(name) LIKE $1
  `;
  return db.query(queryString, values).then((res) => res.rows);
};

exports.getItemBySearch = getItemBySearch;
