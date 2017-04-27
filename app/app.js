'use strict';

// Declare app level module which depends on views, and components
angular.module('angular-tetris', [
  'ngRoute',
  'angular-tetris.main-menu',
  'angular-tetris.game',
  'angular-tetris.tetris'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);