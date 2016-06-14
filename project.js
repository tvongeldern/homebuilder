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
