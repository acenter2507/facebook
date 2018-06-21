'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Authenticators Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([]);
};

/**
 * Check If Authenticators Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  return next();
};
