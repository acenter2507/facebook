(function () {
  'use strict';

  angular
    .module('authenticators')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Authenticators',
      state: 'authenticators.home',
      roles: ['*']
    });
  }
}());
