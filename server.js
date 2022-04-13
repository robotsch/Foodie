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
const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);
app.use(
  expressSession({
    store: new pgSession({
      pool: db,
      tableName: "user_sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "testcookie",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const menuRoute = require("./routes/menu-router");
const addItemRoute = require("./routes/add-item-router");
const cartRoute = require("./routes/cart-summary-router");
const checkoutRoute = require("./routes/complete-order-router");
const smsResponseRoute = require("./routes/sms-response-router");
const loginRoute = require("./routes/login-router");
const registerRoute = require("./routes/register-router");
const logoutRoute = require("./routes/logout-router")
const orderStatusRoute = require("./routes/order-status-router");
const menuSearchRoute = require("./routes/menu-search-router");
const orderHistoryRoute = require("./routes/order-history-router");
const resolveOrderRoute = require("./routes/resolve-order-router")

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/menu", menuRoute);
app.use("/api/additem", addItemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/smsresponse", smsResponseRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/logout", logoutRoute)
app.use("/api/order-status", orderStatusRoute);
app.use("/api/menu-search", menuSearchRoute);
app.use("/api/orders-user-id", orderHistoryRoute);
app.use("/api/resolve-order", resolveOrderRoute)

// Note: mount other resources here, using the same pattern above
const redirectUtils = require("./middleware/auth-redirects");
const authUtils = require("./utils/auth-utils");

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
  res.render("login");
});

app.get("/register", redirectUtils.toHome, (req, res) => {
  res.render("register");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.post("/complete", (req, res) => {
  console.log("request: ", req);
});
