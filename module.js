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
        shoppingService.fetchData($scope.room)
        .then(function success(response){
            console.log("SUCCESS");
            console.log(response);
        }, function failure(response){
            console.log("FAILURE");
            console.log(response);
        });
    };

    $scope.toggle = function(){
        $scope.open = !$scope.open;
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
