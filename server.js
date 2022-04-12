// load .env data into process.env
require("dotenv").config({ silent: true });

// Web server config
const PORT = process.env.PORT || 8080;
const db = require("./db/db.js");
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

// Session setup
const expressSession = require('express-session')
const pgSession = require('connect-pg-simple')(expressSession)
app.use(expressSession({
  store: new pgSession({
    pool: db,
    tableName: 'user_sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: true,
    secure: true
  }
}))

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const menuRoute = require("./routes/menu-router");
const addItemRoute = require("./routes/add-item-router");
const cartRoute = require("./routes/cart-summary-router");
const orderRoute = require("./routes/complete-order-router");
const checkoutRoute = require("./routes/complete-order-router");
const smsResponseRoute = require("./routes/sms-response-router");
const loginRoute = require("./routes/login-router")
const registerRoute = require("./routes/login-router")
//const menuSearchRoute = require("./routes/menu-search");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/menu", menuRoute);
app.use("/api/additem", addItemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/smsresponse", smsResponseRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
//app.use("/api/menuSearch", menuSearchRoute);

// Note: mount other resources here, using the same pattern above
const redirectUtils = require("./utils/auth-redirects")
const authUtils = require("/utils/auth-utils")

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("full-menu");
});

app.get("/search", (req, res) => {
  res.render("search-menu");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/checkout", redirectUtils.toLogin, (req, res) => {
  res.render("checkout");
});

app.get("/orders", redirectUtils.toLogin, (req, res) => {
  res.render("order-history");
});

app.get("/login", redirectUtils.toHome, (req, res) => {
  res.render("login")
})

app.get("/register", redirectUtils.toHome, (req, res) => {
  res.render("register")
})

app.post("/register", redirectUtils.toHome, (req, res) => {

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const menuQueries = require("./db/queries/03_menu_item_queries");

app.post("/search", (req, res) => {
  //console.log("post request: ", req);

  req.session.user_id = "test";

  let body = req.body;

  let searchArr = Object.keys(body);
  let searchString = searchArr[0];

  console.log("searchString: ", searchString);

  return Promise.all([
    menuQueries.getItemBySearch(searchString),
    menuQueries.getAllCategories(),
  ])
    .then((values) => {
      const menuItems = {};

      values[0].forEach((row) => {
        if (!(row.category_id in menuItems)) {
          menuItems[row.category_id] = [];
        }
        menuItems[row.category_id].push(row);
      });

      const categories = {};
      values[1].forEach((row) => {
        categories[row.id] = row.category;
      });
      //console.log(menuItems, categories);
      res.send(
        JSON.stringify({ menuItems: menuItems, categories: categories })
      );
    })
    .catch((err) => {
      res.status(500).send("Failed to get menu and items");
    });
});
