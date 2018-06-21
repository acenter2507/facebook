'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Authenticator = mongoose.model('Authenticator'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Authenticator
 */
exports.create = function(req, res) {
  var authenticator = new Authenticator(req.body);
  authenticator.user = req.user;

  authenticator.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticator);
    }
  });
};

/**
 * Show the current Authenticator
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var authenticator = req.authenticator ? req.authenticator.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  authenticator.isCurrentUserOwner = req.user && authenticator.user && authenticator.user._id.toString() === req.user._id.toString();

  res.jsonp(authenticator);
};

/**
 * Update a Authenticator
 */
exports.update = function(req, res) {
  var authenticator = req.authenticator;

  authenticator = _.extend(authenticator, req.body);

  authenticator.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticator);
    }
  });
};

/**
 * Delete an Authenticator
 */
exports.delete = function(req, res) {
  var authenticator = req.authenticator;

  authenticator.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticator);
    }
  });
};

/**
 * List of Authenticators
 */
exports.list = function(req, res) {
  Authenticator.find().sort('-created').populate('user', 'displayName').exec(function(err, authenticators) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticators);
    }
  });
};

/**
 * Authenticator middleware
 */
exports.authenticatorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Authenticator is invalid'
    });
  }

  Authenticator.findById(id).populate('user', 'displayName').exec(function (err, authenticator) {
    if (err) {
      return next(err);
    } else if (!authenticator) {
      return res.status(404).send({
        message: 'No Authenticator with that identifier has been found'
      });
    }
    req.authenticator = authenticator;
    next();
  });
};
