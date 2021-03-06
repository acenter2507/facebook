(function () {
  'use strict';

  angular
    .module('authenticators')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('authenticators', {
        abstract: true,
        url: '/authenticators',
        template: '<ui-view/>'
      })
      .state('authenticators.home', {
        url: '',
        templateUrl: 'modules/authenticators/client/views/authenticators.client.view.html',
        controller: 'AuthenticatorsController',
        controllerAs: 'vm'
      });
  }
}());
