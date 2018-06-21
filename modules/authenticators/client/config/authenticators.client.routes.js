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
      .state('authenticators.list', {
        url: '',
        templateUrl: 'modules/authenticators/client/views/list-authenticators.client.view.html',
        controller: 'AuthenticatorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Authenticators List'
        }
      })
      .state('authenticators.create', {
        url: '/create',
        templateUrl: 'modules/authenticators/client/views/form-authenticator.client.view.html',
        controller: 'AuthenticatorsController',
        controllerAs: 'vm',
        resolve: {
          authenticatorResolve: newAuthenticator
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Authenticators Create'
        }
      })
      .state('authenticators.edit', {
        url: '/:authenticatorId/edit',
        templateUrl: 'modules/authenticators/client/views/form-authenticator.client.view.html',
        controller: 'AuthenticatorsController',
        controllerAs: 'vm',
        resolve: {
          authenticatorResolve: getAuthenticator
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Authenticator {{ authenticatorResolve.name }}'
        }
      })
      .state('authenticators.view', {
        url: '/:authenticatorId',
        templateUrl: 'modules/authenticators/client/views/view-authenticator.client.view.html',
        controller: 'AuthenticatorsController',
        controllerAs: 'vm',
        resolve: {
          authenticatorResolve: getAuthenticator
        },
        data: {
          pageTitle: 'Authenticator {{ authenticatorResolve.name }}'
        }
      });
  }

  getAuthenticator.$inject = ['$stateParams', 'AuthenticatorsService'];

  function getAuthenticator($stateParams, AuthenticatorsService) {
    return AuthenticatorsService.get({
      authenticatorId: $stateParams.authenticatorId
    }).$promise;
  }

  newAuthenticator.$inject = ['AuthenticatorsService'];

  function newAuthenticator(AuthenticatorsService) {
    return new AuthenticatorsService();
  }
}());
