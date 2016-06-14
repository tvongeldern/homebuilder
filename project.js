app.directive('shoppingProject', function(){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'project.html'
    }

});

app.controller('projectController', function($scope){

    $scope.rooms = [];

    $scope.getProjectData = function(){
        console.log("BALLS");
    }

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

    return {
        fetchData
    }

});
