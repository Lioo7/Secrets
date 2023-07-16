const User = require('../models/User');
const passport = require('../config/passport');
const logger = require('../config/logger');

exports.registerForm = function(req, res) {
  res.render('register');
};

exports.register = function(req, res) {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    logger.error('Registry error: Username or password is missing');
    res.redirect('/register');
    return;
  }

  User.register({ username: username, active: false }, password, function(err, user) {
    if (err) {
      logger.error('Error registering user:', err);
      res.redirect('/register');
    } else {
      logger.info('User registered successfully');
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
};

exports.loginForm = function(req, res) {
  res.render('login');
};

exports.login = async function(req, res) {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    logger.error('Login error: Username or password is missing');
    res.redirect('/login');
    return;
  }

  const user = new User({
    username: username,
    password: password
  });

  req.login(user, function(err) {
    if (err) {
      logger.error(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
    }
  });
};

exports.logout = function(req, res) {
 req.logout(function(err) {
  if (err) {
    logger.error('logout failed', err) ;
  } else {
    logger.info('logout successful');
    res.redirect('/');
  }
});
};
