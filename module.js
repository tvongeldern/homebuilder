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
    };

    $scope.addReady = function(){
        $scope.created.ready = true;
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

    $scope.buy = function(item){
        shoppingService.updateItem(item)
        .then(function success(response){
            $scope.initialize();
        }, function failure(response){
            console.log(response);
        });
    };

    ctrl.getBudget = function(){
        shoppingService.getBudget(project)
        .then(function success(response){
            console.log(response);
            var arr = response;
            var len = response.length;
            for (let i = 0; i < len; i++){
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
            console.log($scope.budget);
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
