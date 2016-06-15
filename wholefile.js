var app = angular.module("shoppingApp",[]);

app.directive('shoppingModule', function(){

    return {
        restrict: 'E',
        scope: {
            room: '@'
        },
        templateUrl: 'module.html'
    }

});

app.controller('shoppingController', function($scope, shoppingService){

    var project = JSON.parse(localStorage.getItem('currentUser') || {}).project;
    var name = JSON.parse(localStorage.getItem('currentUser') || {}).name;
    var ctrl = this;

    $scope.info = null;
    $scope.open = false;
    $scope.items = [];
    $scope.budget = {
        projected: 0,
        spent: 0,
        budget: 0,
        rooms: {}
    };
    $scope.created = {
        name: '',
        budget: ''
    };

    $scope.initialize = function(){
        $scope.loading = true;
        if (!$scope.room.roomName){
            $scope.room = JSON.parse($scope.room);
        }

        var paramsObj = {
            project: project,
            room: $scope.room.roomName
        };

        shoppingService.fetchItems(paramsObj)
        .then(function success(response){
            $scope.loading = false;
            $scope.items = response;
        }, function failure(response){
            $scope.loading = false;
            console.log(response);
        });
        ctrl.getBudget();
    };

    $scope.toggle = function(){
        $scope.open = !$scope.open;
        $scope.created.ready = false;
        $scope.errorMessage = null;
    };

    $scope.addReady = function(){
        $scope.created.ready = true;
        $scope.errorMessage = null;
    };

    $scope.createItem = function(){
        var item = {
            name: $scope.created.name,
            budget: $scope.created.budget,
            room: $scope.room.roomName,
            project: project
        }
        shoppingService.createItem(item)
        .then(function success(response){
            $scope.created = {
                name: '',
                budget: ''
            };
            $scope.initialize();
        }, function failure(response){
            console.log(response);
        });
    };

    $scope.buy = function(item, purchased){
        $scope.errorMessage = null;
        item.buyer = purchased ? "'" + name + "'" : null;
        if (purchased && !item.itemCost){
            $scope.errorMessage = "Enter cost before purchasing item!";
        } else {
            shoppingService.updateItem(item)
            .then(function success(response){
                $scope.initialize();
            }, function failure(response){
                console.log(response);
            });
        }
    };

    ctrl.getBudget = function(){
        shoppingService.getBudget(project)
        .then(function success(response){
            var arr = response;
            var len = response.length;
            for (var i = 0; i < len; i++){
                var item = arr[i];
                var room = $scope.budget.rooms[item.itemRoom];
                $scope.budget.budget += item.itemBudget || 0;
                $scope.budget.spent += item.itemCost || 0;
                $scope.budget.projected += item.itemCost || arr[i].itemBudget || 0;
                if (room && room.budget){
                    room.budget += item.itemBudget || 0;
                    room.spent += item.itemCost || 0;
                    room.projected += item.itemCost || arr[i].itemBudget || 0;
                } else {
                    $scope.budget.rooms[item.itemRoom] = {
                        budget: item.itemBudget || 0,
                        spent: item.itemCost || 0,
                        projected: item.itemCost || arr[i].itemBudget || 0
                    }
                }
            }
        }, function failure(response){
            console.log(response);
        });
    };

});

app.service('shoppingService', function($http, $q){

    function createItem(item){
        var prom = $q.defer();

        var url = "/createitem";
        var data = item;
        $http.post(url, data)
        .success(function(response){
            if (response.success){
                prom.resolve(response);
            } else {
                prom.reject(response);
            }
        })
        .error(function(response){
            prom.resolve(response);
        });
        return prom.promise;
    }

    function fetchItems(params){
        var prom = $q.defer();

        var url = "/getitems";
        var data = params;
        $http.post(url, data)
        .success(function(response){
            if (!response.error){
                prom.resolve(response);
            } else {
                prom.reject(response);
            }
        })
        .error(function(response){
            prom.resolve(response);
        });
        return prom.promise;
    }

    function updateItem(item){
        var prom = $q.defer();

        var url = "/updateitem";
        var data = item;
        $http.post(url, data)
        .success(function(response){
            if (!response.error){
                prom.resolve(response);
            } else {
                prom.reject(response);
            }
        })
        .error(function(response){
            prom.resolve(response);
        });
        return prom.promise;
    }

    function getBudget(project){
        var prom = $q.defer();

        var url = "/getbudget";
        var data = {project: project};
        $http.post(url, data)
        .success(function(response){
            if (!response.error){
                prom.resolve(response);
            } else {
                prom.reject(response);
            }
        })
        .error(function(response){
            prom.resolve(response);
        });
        return prom.promise;
    }

    return {
        createItem,
        fetchItems,
        updateItem,
        getBudget
    }

});

app.directive('shoppingProject', function(){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'project.html'
    }

});

app.controller('projectController', function($scope, projectService){

    $scope.user = {newRoomName: ''};
    $scope.rooms = [];

    $scope.getProjectData = function(){
        $scope.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        projectService.fetchData($scope.user.project)
        .then(function success(response){
            $scope.rooms = response.data;
        }, function failure(response){
            console.log(response)
        });
    };

    $scope.readyAdd = function(){
        $scope.addReady = true;
    };

    $scope.createRoom = function(){
        var roomObj = {
            project: $scope.user.project,
            name: $scope.user.newRoomName
        };
        console.log(roomObj);
        projectService.createRoom(roomObj)
        .then(function success(response){
            $scope.getProjectData();
            $scope.addReady = false;
        }, function failure(response){
            console.log(response);
        });
    };

});

app.service('projectService', function($http, $q){

    function fetchData (project){
        var prom = $q.defer();
        var url = '/projectdata';
        var data = {project: project};
        $http.post(url, data)
        .then(function success(response){
            prom.resolve(response);
        }, function failure(response){
            prom.reject(response);
        });
        return prom.promise;
    }

    function createRoom (room){
        var prom = $q.defer();
        var url = '/createroom';
        var data = room;
        $http.post(url, data)
        .then(function success(response){
            prom.resolve(response);
        }, function failure(response){
            prom.reject(response);
        });
        return prom.promise;
    }

    return {
        fetchData,
        createRoom
    }

});

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
