'use strict';

var _ = require('lodash');
var speakeasy = require('speakeasy');
// Create the chat configuration
module.exports = function (io, socket) {
  socket.on('token', function (req) {
    var secret = req.secret;
    var token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
      window: 2,
      step: 60
    });
    io.sockets.connected[socket.id].emit('token', { token: token });
  });
};
