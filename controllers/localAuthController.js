const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const passport = require('../config/passport')
const logger = require('../config/logger')

// Validation middleware for user registration
const validateRegistration = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
]

exports.registerForm = function (req, res) {
  res.render('register')
}

exports.register = [
  validateRegistration,

  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMSG = 'Registry error: Username or password is invalid'
      logger.error(errorMSG)
      // Pass the 'errors' variable to the view
      return res.render('register', { errors: errors.array() })
    }

    const { username, password } = req.body

    try {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        logger.error('User already exists')
        res.redirect('/register')
        return
      }

      await User.register(new User({ username, active: false }), password)
      logger.info('User registered successfully')

      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets')
      })
    } catch (error) {
      logger.error('Error registering user:', error)
      res.redirect('/register')
    }
  }
]

exports.loginForm = function (req, res) {
  res.render('login')
}

exports.login = [
  validateRegistration,

  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorMSG = 'Login error: Username or password is invalid'
      logger.error(errorMSG)
      // Pass the 'errors' variable to the view
      return res.render('login', { errors: errors.array() })
    }

    const { username, password } = req.body

    try {
      const user = new User({
        username,
        password
      })

      req.login(user, (err) => {
        if (err) {
          logger.error('Error during login:', err)
          res.status(401).redirect('/login')
        } else {
          passport.authenticate('local')(req, res, () => {
            res.redirect('/secrets')
          })
        }
      })
    } catch (error) {
      logger.error('Error during login:', error)
      res.status(401).redirect('/login')
    }
  }
]

exports.logout = function (req, res) {
  req.logout((err) => {
    if (err) {
      logger.error('logout failed', err)
    } else {
      logger.info('logout successful')
      res.redirect('/')
    }
  })
}
