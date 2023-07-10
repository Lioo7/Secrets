const express = require('express');
const router = express.Router();
const localAuthController = require('../controllers/localAuthController');

router.get('/', function (req, res) {
  res.render('home');
});

router.get('/register', localAuthController.registerForm);
router.post('/register', localAuthController.register);
router.get('/login', localAuthController.loginForm);
router.post('/login', localAuthController.login);
router.post('/logout', localAuthController.logout);

module.exports = router;
