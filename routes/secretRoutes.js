const express = require('express');
const router = express.Router();
const secretController = require('../controllers/secretController');
const { ensureAuthenticated } = require('../controllers/googleAuthController');

router.get('/secrets', secretController.getSecrets);
router.get('/submit', ensureAuthenticated, secretController.renderSubmitForm);
router.post('/submit', ensureAuthenticated, secretController.submitSecret);

module.exports = router;
