/**
 * Created by jasper on 2/5/14.
 */
var questoria_app = angular.module('questoria');

questoria_app.factory('threadService', ['$resource',
    function($resource){
        return $resource(BASE_URL + '/api/threads/:threadId', {}, {
            query: {method:'GET', isArray: false}
        });
    }]);