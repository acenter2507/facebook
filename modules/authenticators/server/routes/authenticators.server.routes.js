'use strict';

/**
 * Module dependencies
 */
var authenticatorsPolicy = require('../policies/authenticators.server.policy'),
  authenticators = require('../controllers/authenticators.server.controller');

module.exports = function(app) {
  // Authenticators Routes
  app.route('/api/authenticators').all(authenticatorsPolicy.isAllowed)
    .get(authenticators.list)
    .post(authenticators.create);

  app.route('/api/authenticators/:authenticatorId').all(authenticatorsPolicy.isAllowed)
    .get(authenticators.read)
    .put(authenticators.update)
    .delete(authenticators.delete);

  // Finish by binding the Authenticator middleware
  app.param('authenticatorId', authenticators.authenticatorByID);
};
