'use strict';

var _ = require('lodash');
var speakeasy = require('speakeasy');
var qrcode = require('qrcode');
// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('token_get', function (req) {
    var secret = speakeasy.generateSecret({ length: 20 });
    qrcode.toDataURL(secret.otpauth_url, function (err, image_data) {
      if (err) {
        return io.sockets.connected[socket.id].emit('token_get', {
          error: 'Cannot create qrcode data'
        });
      }
      return io.sockets.connected[socket.id].emit('token_get', {
        secret: secret.base32,
        qrcode: image_data
      });
    });
  });
  socket.on('token_verify', function (req) {
    var secret = req.secret;
    var token = req.token;
    var verified = speakeasy.time.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });
    io.sockets.connected[socket.id].emit('token_verify', { verified: verified });
  });
  socket.on('token', function (req) {
    var secret = req.secret;
    var token = speakeasy.time({
      secret: secret,
      encoding: 'base32'
    });
    io.sockets.connected[socket.id].emit('token', { token: token });
  });
};
