var listaBrejas = angular.module('listaBrejas', []);
 
function mainController($scope, $http) {    
 
    var refresh = function (){
        $http.get('http://10.4.128.109:8080/principal')
            .success(function(data) {
                $scope.Brejas = data;
                $scope.formBreja = {};
                //console.log("Brejas: ", data);
                window.localStorage.setItem("Objeto", JSON.stringify(data));
            })
            .error(function(data) {
                var item =  JSON.parse(window.localStorage.getItem("Objeto"));
                $.each(item, function(i, j) {
                    console.log(j)
                    $("#table").append("<tr><td>"+j.loja+"</td><td>"+j.produto+"</td><td>"+j.preco+"</td><td><button type='button' class='btn btn-default' ng-click='editarBreja(Breja._id)'>Editar</button><button type='button' class='btn btn-primary' ng-click='deletarBreja(Breja._id)'>Remover</button></td></tr>");
                })
                //console.log('Error: ' + data);
            });
    };
    refresh();

    $scope.criarBreja = function() {
        $http.post('http://10.4.128.109:8080/principal', $scope.formBreja)
            .success(function(data) {
                $scope.formBreja = {};
                $scope.Brejas = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deletarBreja = function(id) {
        $http.delete('http://10.4.128.109:8080/principal/' + id)
            .success(function(data) {
                $scope.Brejas = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.editarBreja = function(id) {
        $http.get('http://10.4.128.109:8080/principal/' + id)
            .success(function(data) {
                $scope.formBreja = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
 
    $scope.atualizarBreja = function() {        
        $http.put('http://10.4.128.109:8080/principal/' + $scope.formBreja._id, $scope.formBreja)
        .success( function(response){
            refresh();
        });
    };

    $scope.logout = function() {        
        $http.get('http://10.4.128.109:8080/logout/')
        .success( function(data){
            window.location = data;
        });
    };

 
}