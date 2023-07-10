const User = require('../models/User');
const logger = require('../config/logger');

exports.getSecrets = async function(req, res) {
  try {
    logger.info('getSecrets')
    const usersWithSecrets = await User.find({ 'secret': { $ne: null } });
    if (!usersWithSecrets || usersWithSecrets.length === 0) {
      logger.error('No secrets found');
      res.render('secrets', { usersWithSecrets: [] });
      return;
    }
    logger.info('Found secrets');
    res.render('secrets', { usersWithSecrets: usersWithSecrets });
  } catch (error) {
    logger.error('Error fetching secrets', error);
    res.render('error', { message: 'Error fetching secrets' });
  }
};

exports.renderSubmitForm = function(req, res) {
  logger.info('renderSubmitForm')
  res.render('submit');
};

exports.submitSecret = async function(req, res) {
  logger.info('submitSecret')
  const secret = req.body.secret;

  // Input validation
  if (!secret) {
    logger.error('Secret is missing');
    return;
  }

  logger.info('User ID: ' + req.user.id);
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.error('User not found');
    } else {
      user.secret = secret;
      await user.save();
      logger.info('User updated successfully');
      res.redirect('/secrets');
    }
  } catch (error) {
    logger.error('Error updating user', error);
    res.render('error', { message: 'Error updating user' });
  }
};
