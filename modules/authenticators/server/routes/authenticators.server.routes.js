'use strict';

/**
 * Module dependencies
 */
var authenticatorsPolicy = require('../policies/authenticators.server.policy'),
  authenticators = require('../controllers/authenticators.server.controller');

module.exports = function(app) {
  // Authenticators Routes
  app.route('/api/authenticators/qrcode').get(authenticators.qrcode);
  app.route('/api/authenticators/verify').post(authenticators.verify);
};
