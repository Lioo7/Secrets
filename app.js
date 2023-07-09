require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// eslint-disable-next-line no-unused-vars
const ejs = require('ejs');
const mongoose = require('mongoose');
const winston = require('winston');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

const app = express();
const port = 3000;

// Dependencies
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

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

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
  });

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    logger.info('User Profile:', profile)
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// Routes
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile'] 
}));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    logger.info('Successful authentication');
    res.redirect('/secrets');
  });

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    const {username, password} = req.body;

    User.register({username: username, active: false}, password, function(err, user) {
        if (err) {
            logger.error('Error registering user:', err);
            res.redirect('/register');
        } else {
            logger.info('User registered successfully');
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            })
        }
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', async function (req, res) {
    const {username, password} = req.body;
    const user = new User({
        username: username,
        password: password
    });

    req.login(user, function(err) {
        if (err) {
            logger.error(err);
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            });
        }
    });
});

app.post('/logout', function(req, res){
    req.logout(function(err) {
      if (err) {
        logger.error('logout failed', err) ;
      } else {
        logger.info('logout successful');
        res.redirect('/');
      }
    });
  });

app.get('/secrets', function(req, res){
    if (req.isAuthenticated()) {
        logger.info('The user is authenticated')
        res.render('secrets');
    } else {
        logger.error('The user is not authenticated');
        res.redirect('/login');
    }
});


// Start the server
app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  });