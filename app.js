
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// eslint-disable-next-line no-unused-vars
const ejs = require('ejs');
const mongoose = require('mongoose');
const winston = require('winston');
const md5 = require('md5');

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
});

const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', async function (req, res) {
    try {
        const { username, password } = req.body;
        const newUser = new User({
           email: username,
           password: md5(password)
        });
        const addUser = await newUser.save();  
        logger.info(`User: ${addUser} saved successfully`);
        res.render('secrets');
    } catch (error) {
        logger.error('An error occurred:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });     
    }
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', async function (req, res) {
    try {
        const { username, password } = req.body;
        const foundUser = await User.findOne({ email: username });

        if (foundUser) {
            const isPasswordCorrect = (md5(password) === foundUser.password);
            
            if (isPasswordCorrect) {
                logger.info(`User: ${foundUser.email} authenticated successfully`);
                res.render('secrets'); 
            } else {
                logger.info(`User: ${foundUser.email} authentication failed (wrong password)`);
                res.status(401).json({ error: 'Authentication failed' });
            }
        } else {
            logger.error(`User authentication failed (wrong email)`);
            res.status(401).json({ error: 'Authentication failed' });
        }
    } catch (error) {
        logger.error('An error occurred:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});


// Start the server
app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  });