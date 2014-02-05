/**
 * Created by jasper on 2/5/14.
 */
var questoria_app = angular.module('questoria');

questoria_app.factory('commentService', ['$http',
    function($http){
//        return $resource(BASE_URL + '/api/threads/:threadId\/comments/:commentId', {}, {
//            query: {method:'GET', isArray: false},
//            save: {transformRequest: function(data){console.log(this);}}
//        });
        return {
            getUrl: function(params){
                return BASE_URL + '/api/threads/' + (params.threadId?params.threadId:'') +
                    '/comments' + (params.commentId?('/'+params.commentId):'');
            },
            query: function(params, cb){
                $http({method: 'GET', url: this.getUrl(params)}).success(cb);
            },
            put: function(params, cb){
                var url_params = clone(params);
                url_params.threadId = threadId;
                $http({method:'PUT', url: this.getUrl(url_params), data: params}).success(cb);
            },
            post: function(threadId, params, cb, cb_error){
                var url_params = clone(params);
                url_params.threadId = threadId;
                $http({method:'POST', url: this.getUrl(url_params), data: params}).success(cb).error(cb_error);
            },
            remove:function(threadId, params, cb){
                $http({method:'DELETE', url: this.getUrl(params), data: params}).success(cb);
            }
        }
    }]);