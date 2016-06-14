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

    $scope.info = null;
    $scope.open = false;

    $scope.initialize = function(){
        console.log(typeof $scope.room);
        $scope.room = JSON.parse($scope.room);
    };

    $scope.toggle = function(){
        $scope.open = !$scope.open;
        $scope.readyToAdd = false;
    };

    $scope.addReady = function(){
        $scope.readyToAdd = true;
    };

});

app.service('shoppingService', function($http, $q){

    function fetchData(roomName){
        var prom = $q.defer();

        var url = "/data-endpoint";
        var data = {
            room: roomName
        };
        $http.post(url, data)
        .success(function(response){
            prom.resolve(response.message);
        })
        .error(function(response){
            prom.resolve(response.message);
        });
        return prom.promise;
    }

    return {
        fetchData
    }

});
