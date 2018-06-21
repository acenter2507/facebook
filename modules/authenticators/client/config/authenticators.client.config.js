(function () {
  'use strict';

  angular
    .module('authenticators')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Authenticators',
      state: 'authenticators',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'authenticators', {
      title: 'List Authenticators',
      state: 'authenticators.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'authenticators', {
      title: 'Create Authenticator',
      state: 'authenticators.create',
      roles: ['user']
    });
  }
}());
