const logger = require('../config/logger')

exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

exports.googleCallback = function (req, res) {
  logger.info('Successful authentication')
  res.redirect('/secrets')
}
