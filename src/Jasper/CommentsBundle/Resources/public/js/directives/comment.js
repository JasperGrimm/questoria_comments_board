/**
 * Created by jasper on 2/5/14.
 */
var questoria_app = angular.module('questoria');
var tree_state = {};
questoria_app.directive('commentsThread', ['growl', function(growl){
    return {
        restrict: 'AC',
        transclude: false,
        templateUrl: ASSETS_PATH + '/views/comments.html',
        replace: true,
        link: function(scope, element){
            scope.$root.$on("comment_create", function(e, args){
                growl.addSuccessMessage("Коментарий успешно добавлен.");
                scope.comments = args.comments;
                args.element[0].reset();
                args.scope.reset(args.element);
            });
        },
        controller: function($scope, threadService, commentService) {
            $.isLoading({ text: 'Идет загрузка...' });
            var threads = threadService.query(function(){
                if (threads.threads.length){
                    var threadObj = threads.threads[0];

                    if(threadObj.is_commentable) {
                        commentService.query({"threadId": threadObj.id}, function(comments){
                            $.isLoading('hide');
                            $scope.comments = comments.comments;
                        });
                    }

                }else{
                    var new_thread = new threadService();
                    new_thread.fos_comment_thread = {permalink: "http://example.com"};
                    new_thread.$save();
                    $.isLoading('hide');
                }
            });


        }
    }
}]);

questoria_app.directive('commentForm', ['threadService', 'commentService', function(threadService, commentService){
    function setErrors(element, growl){
        growl.addErrorMessage("Произошла ошибка добавления коментария. Проверьте правильность заполнения формы.");
        console.log(element);
        $.isLoading('hide');
        element.find('input, textarea').each(function(index, element){
            element = angular.element(element);
            if (!element.text() || element.text()==""){
                if (!element.hasClass('ng-dirty')){
                    element.addClass('ng-dirty');
                }
            }
        });
    }
    return {
        restrict: 'AC',
        transclude: false,
        replace: true,
        templateUrl: ASSETS_PATH + '/views/comment_form.html',
        scope: {
            parentcomment: '=parentcomment'
        },
        link: function(scope, element, attrs){

                element.find('.btn-success').click(function(e){
                    scope.$apply(function(){
                        if (undefined != scope.parentcomment){
                            scope.reply(element);
                        }else{
                            scope.create(scope.comment, element);
                        }
                    });
                    return false;
                });
        },
        controller: function($scope, threadService, commentService, growl) {
            var threads = threadService.query(function(){
                if (threads.threads.length){
                    var threadObj = threads.threads[0];
                    $scope.create = function(comment, element){
                        if(undefined == comment){
                            setErrors(element, growl);
                            return;
                        }
                        $.isLoading({ text: 'Идет загрузка...' });
                        commentService.post(threadObj.id, {fos_comment_comment : {"body": comment.text, author: comment.author}}, function(){
                            commentService.query({"threadId": threadObj.id}, function(comments){
                                $.isLoading('hide');
                                $scope.$root.$emit("comment_create", {comments: comments.comments, element: element, scope:$scope});
                            });
                        }, function(err, status){
                            if (status == 500 || status == 400 || status == 401){
                                setErrors(element, growl);//.find('input, textarea').addClass('ng-dirty');
                            }
                        });
                    };

                    $scope.reply = function(element){
                        if(undefined == $scope.comment){
                            setErrors(element, growl);
                            return;
                        }
                        $.isLoading({ text: 'Идет загрузка...' });
                        commentService.post(threadObj.id, {"fos_comment_comment": {"body": $scope.comment.text, author: $scope.comment.author}, "parentId": $scope.parentcomment?$scope.parentcomment.comment.id:null}, function(r){
                            console.log('create');
                            commentService.query({"threadId": threadObj.id}, function(comments){
                                $.isLoading('hide');
                                $scope.$root.$emit("comment_create", {comments: comments.comments, element: element, scope: $scope});
                            });
                        }, function(err, status){
                            if (status == 500 || status == 400 || status == 401){
                                setErrors(element, growl);//.find('input, textarea').addClass('ng-dirty');
                            }
                        });
                    };

                    $scope.reset = function(element){
                        $scope.comment = {};
                        element.removeClass('ng-dirty');
                        element.find('input, textarea').each(function(index, element){
                            element = angular.element(element);
                            if (element.hasClass('ng-dirty')){
                                element.removeClass('ng-dirty');
                            }
                        });
                    }
                }
            });
        }
    }
}]);

questoria_app.directive('reply', function(){
    return {
        restrict: 'AC',
        transclude: false,
        replace: false,
        link: function(scope, element, attrs) {
            scope.toogle_form = tree_state[scope.comment.comment.id]?tree_state[scope.comment.comment.id].toggle_form:false;
            element.click(function(){
               scope.$apply(function(){
                   scope.toogle_form = !scope.toogle_form;
                   if (undefined == tree_state[scope.comment.comment.id]){
                       tree_state[scope.comment.comment.id] = {toggle_form: scope.toogle_form};
                   }else{
                       tree_state[scope.comment.comment.id].toggle_form = scope.toogle_form;
                   }
               });
            });
        }

    }
});

questoria_app.directive('commentRow', function(){
    return {
        restrict: 'AC',
        transclude: false,
        replace: true,
        templateUrl: ASSETS_PATH + '/views/comment_row.html',
        scope: {
            comment: '='
        },
        link: function(scope, element, attrs) {

        }

    }
});

questoria_app.directive('expandable', function(){
   return {
       restrict: 'AC',
       replace:false,
       link: function(scope, element){
           scope.expanded = tree_state[scope.comment.comment.id]?tree_state[scope.comment.comment.id].expanded:false;
           scope.$on('expand', function(e, expanded){
               scope.expanded = expanded;
           });
       }
   }
});

questoria_app.directive('expander', function(){
    return {
        restrict:'AC',
        replace: false,
        link: function(scope, element){
            scope.expanded = tree_state[scope.comment.comment.id]?tree_state[scope.comment.comment.id].expanded:false;
            scope.toggle = function(){
                scope.expanded = !scope.expanded;
                if (undefined != tree_state[scope.comment.comment.id]){
                    tree_state[scope.comment.comment.id].expanded = scope.expanded;
                }else{
                    tree_state[scope.comment.comment.id] = {expanded: scope.expanded};
                }
                //element.text(scope.expanded?'Свернуть':'Развернуть('+scope.comment.children.length + ')');
                scope.$emit('expand', scope.expanded);
            }

            scope.getCountComments = function(comment){
                var count = 0;
                for (var index in comment.children){
                    count++;
                    if (comment.children[index].children.length){
                        count += scope.getCountComments(comment.children[index]);
                    }
                }
                return count;
            }
        }
    }
})