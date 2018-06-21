'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  speakeasy = require('speakeasy'),
  qrcode = require('qrcode'),
  Authenticator = mongoose.model('Authenticator'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.qrcode = function (req, res) {
  var secret = speakeasy.generateSecret({ length: 20 });
  qrcode.toDataURL(secret.otpauth_url, function (err, image_data) {
    if (err) {
      return res.status(400).send({ message: 'Has error when convert Secret to QRCode' });
    }
    return res.jsonp({ secret: secret.base32, qrcode: image_data });
  });
};
exports.verify = function (req, res) {
  var secret = req.body.secret;
  var token = req.body.token;
  var verified = speakeasy.time.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });
  return res.jsonp(verified);
};
exports.create = function (req, res) {
  var authenticator = new Authenticator(req.body);
  authenticator.user = req.user;

  authenticator.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticator);
    }
  });
};
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var authenticator = req.authenticator ? req.authenticator.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  authenticator.isCurrentUserOwner = req.user && authenticator.user && authenticator.user._id.toString() === req.user._id.toString();

  res.jsonp(authenticator);
};
exports.update = function (req, res) {
  var authenticator = req.authenticator;

  authenticator = _.extend(authenticator, req.body);

  authenticator.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticator);
    }
  });
};
exports.delete = function (req, res) {
  var authenticator = req.authenticator;

  authenticator.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticator);
    }
  });
};
exports.list = function (req, res) {
  Authenticator.find().sort('-created').populate('user', 'displayName').exec(function (err, authenticators) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authenticators);
    }
  });
};
exports.authenticatorByID = function (req, res, next, id) {

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
