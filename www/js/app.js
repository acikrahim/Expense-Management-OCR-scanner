// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('finance-app', ['ionic', 'starter.controllers', 'chart.js', 'firebase', 'ngCordova'])
.run(function($ionicPlatform, $state, $rootScope) {
	$ionicPlatform.ready(function() {
    	// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    	// for form inputs)
    	if (window.cordova && window.cordova.plugins.Keyboard) {
    		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    		cordova.plugins.Keyboard.disableScroll(true);
    	}
    	if (window.StatusBar) {
    	  // org.apache.cordova.statusbar required
    	  StatusBar.styleDefault();
    	}
    	$rootScope.logout = function () {
    		console.log("Logging out from the app");
    		$state.go('signup');
}
    });
})
.factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
        var ref = new Firebase("https://financelogin.firebaseio.com/");
        return $firebaseAuth(ref);
}])
.config( function($stateProvider, $urlRouterProvider)   {
	$stateProvider
	.state('login', {
        url: '/login',
        templateUrl: 'templates/login-page.html',
        controller: 'LoginCtrl'
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/sign-up.html',
        controller: 'SignupCtrl'
    })
	.state('instruction', {
        url: '/instruction',
        templateUrl: 'templates/instruction.html'
        
    })
    .state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})
		.state('app.expense', {
			url: '/expense',
			views: {
				'menuContent': {
					templateUrl: 'templates/expense.html',
					controller: 'expenseCtrl'
				}
			}
		})
		.state('app.budget', {
			url: '/budget',
			views: {
				'menuContent': {
					templateUrl: 'templates/budget.html',
					 controller: 'budgetCtrl'
				}
			}
		})
		.state('app.ocr', {
			url: '/ocr',
			views: {
				'menuContent': {
					templateUrl: 'templates/ocr.html',
					controller: 'ocrCtrl'
				}
			}
	    })
	    .state('app.statistic', {
	        url: '/statistic',
	        views: {
	            'menuContent': {
	                templateUrl: 'templates/statistic.html',
	                controller: 'statisticCtrl'
	            }
	        }
	    })
	    .state('app.report', {
	        url: '/report',
	        views: {
	            'menuContent': {
	                templateUrl: 'templates/report.html',	
	                controller: 'reportCtrl'
	            }
	        }
	    })
	    .state('app.ocr-save', {
                url: '/ocr-save',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ocr-save.html',
                        controller: 'saveocrCtrl'
                    }
                }
            })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/signup');
});