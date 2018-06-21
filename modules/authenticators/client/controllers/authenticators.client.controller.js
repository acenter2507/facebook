(function () {
  'use strict';

  // Authenticators controller
  angular
    .module('authenticators')
    .controller('AuthenticatorsController', AuthenticatorsController);

  AuthenticatorsController.$inject = ['$scope', '$http', 'Socket', '$interval'];

  function AuthenticatorsController($scope, $http, Socket, $interval) {
    var vm = this;
    vm.secret = '';
    vm.token = '';
    vm.interval = null;
    vm.timer = 0;
    vm.verified = false;

    onCreate();
    function onCreate() {
      if (!Socket.socket) {
        Socket.connect();
      }
    }

    vm.handleGetQRCode = function () {
      $http.get('/api/authenticators/qrcode')
        .success(function (res) {
          vm.qrcode = res.qrcode;
          vm.secret = res.secret;
        })
        .error(function (err) {
          console.log(err);
        });
    };
    vm.handleVerifyToken = function () {
      $http.post('/api/authenticators/verify', { token: vm.token, secret: vm.secret })
        .success(function (res) {
          vm.verified = res;
        })
        .error(function (err) {
          console.log(err);
        });
    };
    vm.handleStartGetToken = function () {
      Socket.on('token', function (res) {
        console.log(res);
        var token = res.token;
        if (token !== vm.token) {
          vm.timer = 1;
        } else {
          vm.timer += 1;
        }
        vm.token = token;
      });
      if (!vm.interval) {
        var vm.interval = $interval(function () {
          Socket.emit('token', { secret: vm.secret });
        }, 1000);
      }
    }
    vm.handleStopGetToken = function () {
      Socket.removeListener('token');
      if (vm.interval) {
        $interval.cancel(vm.interval);
      }
    }
    function handleStartTrankingToken() {
    }
  }
}());
