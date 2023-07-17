const express = require('express')

const router = express.Router()
const passport = require('../config/passport')
const googleAuthController = require('../controllers/googleAuthController')

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

router.get(
  '/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthController.googleCallback
)

module.exports = router
