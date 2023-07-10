const express = require('express');
const router = express.Router();

// Import route modules
const localAuthRoutes = require('./localAuthRoutes');
const secretRoutes = require('./secretRoutes');

// Mount sub-routes
router.use('/', localAuthRoutes);
router.use('/', secretRoutes);

module.exports = router;
