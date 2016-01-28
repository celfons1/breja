var auth = angular.module('auth', []);

function authController($scope, $http) {      

    $scope.login = function() {
            $http.post('http://10.4.128.109:8080/login', $scope.formUser)
                .success(function(data) {
                    $scope.formUser = {};
                    $scope.formUser = data; 
                    window.location = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
     $scope.registrar = function() {
            $http.get('http://10.4.128.109:8080/signup', $scope.formUser)
                .success(function(data) {
                    $scope.formUser = {};
                    $scope.formUser = data;
                    window.location = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
        $scope.registro = function() {
            $http.post('http://10.4.128.109:8080/signup', $scope.formUser)
                .success(function(data) {
                    $scope.formUser = {};
                    $scope.formUser = data;
                    window.location = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
 };