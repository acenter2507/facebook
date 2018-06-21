(function () {
  'use strict';

  // Authenticators controller
  angular
    .module('authenticators')
    .controller('AuthenticatorsController', AuthenticatorsController);

  AuthenticatorsController.$inject = ['$scope', '$http'];

  function AuthenticatorsController($scope, $http) {
    var vm = this;
    vm.secret = '';


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
          console.log(res);
        })
        .error(function (err) {
          console.log(err);
        });
    };
  }
}());
