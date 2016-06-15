app.directive('shoppingUser', function(){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'user.html'
    }

});

app.controller('userController', function($scope, userService){

    $scope.authError = null;

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
            if (response.length){
                $scope.userObj.recognized = true;
                localStorage.setItem('currentUser', JSON.stringify($scope.userObj));
                $scope.populate();
            } else {
                console.log("NOMATCH");
                $scope.authError = "Project name \"" + $scope.userObj.project + "\" was not recognized, would you like to create a new project by that name?";
            }
        }, function failure(response){
            console.log(response);
            $scope.authError = "Sorry, we are having trouble connecting to our database";
        });
    };

    $scope.exit = function(){
        localStorage.removeItem('currentUser');
        $scope.userObj = {
            name: null,
            project: null
        };
        $scope.populate();
        $scope.authError = null;
    };

    $scope.tryAgain = function(){
        $scope.authError = null;
    };

    $scope.createProject = function(user){
        userService.userCheck(user)
        .then(function success (response){
            console.log(response);
            if (!response.length){
                userService.createProject(user)
                .then(function success(response){
                    if (response.error){
                        console.log(response);
                        $scope.authError = "We could not create your project. Apologies.";
                    } else {
                        $scope.userObj.recognized = true;
                        localStorage.setItem('currentUser', JSON.stringify($scope.userObj));
                        $scope.populate();
                    }
                }, function error(response){
                    console.log(response);
                    $scope.authError = "We could not create your project. Apologies."
                });
            } else {
                $scope.authError = "That project name is already taken, please try another one";
            }
        }, function failure(response){
            console.log(response);
            $scope.authError = "We could not create your project. Apologies."
        });

    };

});

app.service('userService', function($http, $q){

    function userCheck(user){
        var prom = $q.defer();
        var url = '/userdata';
        var data = user;
        $http.post(url, data)
        .success(function(response){
            if (response.error){
                prom.reject(response);
            } else {
                prom.resolve(response);
            }
        })
        .error(function(response){
            prom.reject(response);
        });
        return prom.promise;
    }

    function createProject(user){
        var prom = $q.defer();
        var url = '/createproject';
        var data = user;
        $http.post(url, data)
        .success(function(response){
            if (!response.error){
                prom.resolve(response);
            } else {
                prom.reject(response);
            }
        })
        .error(function(response){
            prom.reject(response);
        });
        return prom.promise;
    }

    return {
        userCheck,
        createProject
    }

});
