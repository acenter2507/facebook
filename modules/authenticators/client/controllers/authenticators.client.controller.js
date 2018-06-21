(function () {
  'use strict';

  // Authenticators controller
  angular
    .module('authenticators')
    .controller('AuthenticatorsController', AuthenticatorsController);

  AuthenticatorsController.$inject = ['$scope', '$http'];

  function AuthenticatorsController($scope, $http) {
    var vm = this;


    vm.handleGetQRCode = function () {
      $http.get('/api/authenticators/qrcode')
        .success(function (img) { vm.qrcode = img; })
        .error(function (err) { console.log(err); });
    };
  }
}());
