(function () {
  'use strict';

  // Authenticators controller
  angular
    .module('authenticators')
    .controller('AuthenticatorsController', AuthenticatorsController);

  AuthenticatorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'authenticatorResolve'];

  function AuthenticatorsController ($scope, $state, $window, Authentication, authenticator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.authenticator = authenticator;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Authenticator
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.authenticator.$remove($state.go('authenticators.list'));
      }
    }

    // Save Authenticator
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.authenticatorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.authenticator._id) {
        vm.authenticator.$update(successCallback, errorCallback);
      } else {
        vm.authenticator.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('authenticators.view', {
          authenticatorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
