const User = require('../models/User')
const passport = require('../config/passport')
const logger = require('../config/logger')

exports.registerForm = function (req, res) {
  res.render('register')
}

exports.register = async function (req, res) {
  const { username, password } = req.body

  // Input validation
  if (!username || !password) {
    logger.error('Registry error: Username or password is missing')
    res.redirect('/register')
    return
  }

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

exports.loginForm = function (req, res) {
  res.render('login')
}

exports.login = async function (req, res) {
  const { username, password } = req.body

  // Input validation
  if (!username || !password) {
    logger.error('Login error: Username or password is missing')
    res.status(401).redirect('/login')
    return
  }

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
