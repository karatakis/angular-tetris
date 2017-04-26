'use strict';

angular.module('angular-tetris.main-menu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'main-menu/main-menu.html',
    controller: 'MainMenuCtrl'
  });
}])

.controller('MainMenuCtrl', [function() {
    
}]);