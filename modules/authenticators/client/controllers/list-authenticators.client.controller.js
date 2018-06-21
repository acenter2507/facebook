(function () {
  'use strict';

  angular
    .module('authenticators')
    .controller('AuthenticatorsListController', AuthenticatorsListController);

  AuthenticatorsListController.$inject = ['AuthenticatorsService'];

  function AuthenticatorsListController(AuthenticatorsService) {
    var vm = this;

    vm.authenticators = AuthenticatorsService.query();
  }
}());
