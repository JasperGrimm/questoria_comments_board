/**
 * Created by jasper on 2/5/14.
 */
var questoria_app = angular.module('questoria', ['ui.bootstrap', 'ngResource', 'ngCookies', 'angular-growl']);

questoria_app.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(4000);
}]);

//questoria_app.factory('loadingInterceptor', function() {
//    return {
//        request: function(config) {
//            if (0 == $('.isloading-overlay').length)
//                $.isLoading({ text: 'Идет загрузка...' });
//            return config;
//        },
//        response: function(response) {
//            $.isLoading('hide');
//            return response;
//        }
//    }
//});
//
//questoria_app.config(function ($httpProvider) {
//    $httpProvider.interceptors.push('loadingInterceptor');
//});


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}