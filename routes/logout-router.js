const express = require('express');
const router = express.Router();

// Destroy session and redirect user to main page
router.get("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;