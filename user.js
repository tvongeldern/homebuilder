app.directive('shoppingUser', function(){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'user.html'
    }

});

app.controller('userController', function($scope, userService){

    $scope.userObj = {
        name: null,
        project: null
    };

    $scope.populate = function(){
        var ls = localStorage.getItem('currentUser') || '{}';
        ls = JSON.parse(ls);
        if (ls.recognized){
            $scope.userObj = {
                name: ls.name,
                project: ls.project,
                recognized: true
            };
        }
    };

    $scope.verify = function(){
        userService.userCheck($scope.userObj)
        .then(function success(response){
            $scope.userObj.recognized = true;
            localStorage.setItem('currentUser', JSON.stringify($scope.userObj));
            $scope.populate();
        }, function failure(response){
            console.log(response);
        });
    };

    $scope.exit = function(){
        localStorage.removeItem('currentUser');
        $scope.userObj = {
            name: null,
            project: null
        };
        $scope.populate();
    }

});

app.service('userService', function($http, $q){

    function userCheck(user){
        var prom = $q.defer();
        prom.resolve(user);
        return prom.promise;
    }

    return {
        userCheck
    }

});
