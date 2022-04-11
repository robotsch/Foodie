// load .env data into process.env
require("dotenv").config({ silent: true });

// Web server config
const PORT = process.env.PORT || 8080;
const db = require("./db/db.js");
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

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

app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: [
      "dde30aed83711ab341760f40cfe551de90c28607",
      "4fa2d880a7d7e48c2b652ad07df215ad14020fbf",
    ],
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const menuRoute = require("./routes/menu-router");
const addItemRoute = require("./routes/add-item-router");
const cartRoute = require("./routes/cart-summary-router");
const orderRoute = require("./routes/complete-order-router");
const checkoutRoute = require("./routes/complete-order-router");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

app.use("/api/menu", menuRoute);
app.use("/api/additem", addItemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/checkout", checkoutRoute);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("full-menu");
});

app.get("/test", (req, res) => {
  res.render("search-menu");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
