// Authenticators service used to communicate Authenticators REST endpoints
(function () {
  'use strict';

  angular
    .module('authenticators')
    .factory('AuthenticatorsService', AuthenticatorsService);

  AuthenticatorsService.$inject = ['$resource'];

  function AuthenticatorsService($resource) {
    return $resource('api/authenticators/:authenticatorId', {
      authenticatorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
