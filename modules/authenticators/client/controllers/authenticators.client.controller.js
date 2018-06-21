(function () {
  'use strict';

  // Authenticators controller
  angular
    .module('authenticators')
    .controller('AuthenticatorsController', AuthenticatorsController);

  AuthenticatorsController.$inject = ['$scope', 'Socket', '$interval'];

  function AuthenticatorsController($scope, Socket, $interval) {
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
      Socket.on('token_get', function (res) {
        vm.qrcode = res.qrcode;
        vm.secret = res.secret;
        Socket.removeListener('token_get');
      });
      Socket.emit('token_get');
      // $http.get('/api/authenticators/qrcode')
      //   .success(function (res) {
      //     vm.qrcode = res.qrcode;
      //     vm.secret = res.secret;
      //   })
      //   .error(function (err) {
      //     console.log(err);
      //   });
    };
    vm.handleVerifyToken = function () {
      Socket.on('token_verify', function (res) {
        vm.verified = res.verified;
        Socket.removeListener('token_verify');
      });
      Socket.emit('token_verify', { token: vm.tokenValid, secret: vm.secret });
      // $http.post('/api/authenticators/verify', { token: vm.tokenValid, secret: vm.secret })
      //   .success(function (res) {
      //     vm.verified = res;
      //   })
      //   .error(function (err) {
      //     console.log(err);
      //   });
    };
    vm.handleStartGetToken = function () {
      Socket.on('token', function (res) {
        var token = res.token;
        if (token !== vm.token) {
          vm.timer = 1;
        } else {
          vm.timer += 1;
        }
        vm.token = token;
      });
      if (!vm.interval) {
        vm.interval = $interval(function () {
          Socket.emit('token', { secret: vm.secret });
        }, 1000);
      }
    };
    vm.handleStopGetToken = function () {
      Socket.removeListener('token');
      if (vm.interval) {
        $interval.cancel(vm.interval);
      }
      vm.timer = 0;
      vm.token = '';
    };
  }
}());
