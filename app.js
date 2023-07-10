require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const { connect } = require('./config/database');
const logger = require('./config/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
connect();

// Routes
app.use('/', require('./routes/mainRoutes'));
app.use('/auth', require('./routes/googleAuthRoutes'));

// Start the server
app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
