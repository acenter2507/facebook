'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Authenticator Schema
 */
var AuthenticatorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Authenticator name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Authenticator', AuthenticatorSchema);
