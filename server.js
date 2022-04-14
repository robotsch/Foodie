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

// Sass setup
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
      name: "foodie_session",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static("public"));

// Router imports
const menuRoute = require("./routes/menu-router");
const cartRoute = require("./routes/cart-summary-router");
const checkoutRoute = require("./routes/complete-order-router");
const smsResponseRoute = require("./routes/sms-response-router");
const loginRoute = require("./routes/login-router");
const registerRoute = require("./routes/register-router");
const logoutRoute = require("./routes/logout-router");
const orderStatusRoute = require("./routes/order-status-router");
const menuSearchRoute = require("./routes/menu-search-router");
const orderHistoryRoute = require("./routes/order-history-router");
const resolveOrderRoute = require("./routes/resolve-order-router");
const orderDetailsRoute = require("./routes/modal-card-router")

// Resource routes
app.use("/api/menu", menuRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/smsresponse", smsResponseRoute);
app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/order-status", orderStatusRoute);
app.use("/api/menu-search", menuSearchRoute);
app.use("/api/orders-user-id", orderHistoryRoute);
app.use("/api/resolve-order", resolveOrderRoute);
app.use("/api/get-order-details", orderDetailsRoute)

// Import redirect utilities for visitors/registered users
const redirectUtils = require("./middleware/auth-redirects");

app.get("/", (req, res) => {
  res.render("full-menu", { user: req.session.user_id });
});

app.get("/search", (req, res) => {
  res.render("search-menu", { user: req.session.user_id });
});

app.get("/cart", (req, res) => {
  res.render("cart", { user: req.session.user_id });
});

app.get("/orders", redirectUtils.toLogin, (req, res) => {
  res.render("order-history", { user: req.session.user_id });
});

app.get("/login", redirectUtils.toHome, (req, res) => {
  res.render("login", { user: req.session.user_id });
});

app.get("/register", redirectUtils.toHome, (req, res) => {
  res.render("register", { user: req.session.user_id });
});

app.listen(PORT, () => {
  console.log(`Foodie app listening on port ${PORT}`);
});
