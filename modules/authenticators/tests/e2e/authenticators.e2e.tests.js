'use strict';

describe('Authenticators E2E Tests:', function () {
  describe('Test Authenticators page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/authenticators');
      expect(element.all(by.repeater('authenticator in authenticators')).count()).toEqual(0);
    });
  });
});
