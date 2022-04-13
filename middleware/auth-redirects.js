/**
 * Redirect middleware for redirecting auth/noauth users
 *  to home/login page, respectively
 */

const toLogin = function(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  next();
};

const toHome = function(req, res, next) {
  if (req.session.user_id) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  toLogin,
  toHome
};