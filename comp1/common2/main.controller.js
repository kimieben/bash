app.controller('MainController', [
  '$scope',
  '$mdSidenav',
  '$state',
  function(
    $scope,
    $mdSidenav, 
    $state){
  
    $scope.showMenu = false;
    $scope.currentMenuNavItem = 'front';
  
    /*
    // Legacy code removed
    $scope.toggleMenuBar = function() {
      $mdSidenav('topMenu')
        .toggle()
        .then(function() {
          $scope.showMenu = !$scope.showMenu;
        });
    };
    */
  
    $scope.toggleMenuBar1 = function() {
      $scope.showMenu1 = !$scope.showMenu1;
    };
  
    $scope.setMenu = function(Menu) {
      $scope.currentMenuNavItem = Menu;
      $state.go($scope.currentMenuNavItem);
  
      $scope.toggleMenuBar1();
      /*
      $mdSidenav('topMenu')
        .close()
        .then(function() {
          $scope.showMenu = false;
        });
      */
    };
  
    $scope.isWebOS = isWebOS;
    $scope.devices = [];
    $scope.room_devices = [];
    $scope.signage_devices = [];
  
    $scope.td_style={'padding':'5px 5px 5px 5px','margin':'5px 5px 5px 5px'};
  }]);
  