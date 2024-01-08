app.controller('BackupController', ['$scope', '$http', '$filter', '$uibModal',
function($scope, $http, $filter, $uibModal) {

	// directory ..
	$scope.rootDir = true;
	$scope.reverse = false;

	$scope.animationsEnabled = true;
    $scope.dragoverCallback = function(event, index, external, type) {
			return true;
    };

    $scope.dropCallback = function(event, index, item, external, type, allowedType) {
        return item;
    };

	$scope.openDialog = function (size, controller, template, action) {

		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: template,
			controller: controller,
			size: size,
			resolve: {
				items: function () {
					return  {
					action: action
					};
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			if(angular.isUndefined(selectedItem)) {
			} else {
				if(controller == "backupTableCtrl" || controller == "restoreTableCtrl") { 
					$scope.backupList.push(selectedItem);
					$scope.resetAll();
				}
				if(controller == "deleteBackupCtrl") 
					$scope.list_backup();
			}	
			console.log('modal close: ', selectedItem);
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});
	};

	$scope.open_backuptable = function(index){
		$scope.openDialog('lg', 'backupTableCtrl', 'backupTable.html', true);
	}
	$scope.open_restoretable = function(index){
		$scope.openDialog('lg', 'restoreTableCtrl', 'restoreTable.html', true);
	}
	$scope.backupInput = {};
	$scope.filteredList = [];
	$scope.searchText = "";
	$scope.checkboxes = { 'checked': false, items: {}, 'active': false};

	// watch for check all checkbox
	$scope.$watch('checkboxes.checked', function(value) {
		angular.forEach($scope.filteredList, function(item) {
			if (angular.isDefined(item.id)) {
				$scope.checkboxes.items[item.id] = value;
			}
		});
	});
	// watch for data checkboxes
	$scope.$watch('checkboxes.items', function(values) {
		if (!$scope.filteredList.length) {
			return;
		}
		var checked = 0, unchecked = 0,
		total = $scope.filteredList.length;
		angular.forEach($scope.filteredList, function(item) {
			checked   +=  ($scope.checkboxes.items[item.id]) || 0;
			unchecked += (!$scope.checkboxes.items[item.id]) || 0;
		});
		if ((unchecked == 0) || (checked == 0)) {
			$scope.checkboxes.checked = (checked == total);
		}
		if(checked > 0) $scope.checkboxes.active = true;
		else $scope.checkboxes.active = false;
		// grayed checkbox
		angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
	}, true);

	$scope.delete_backup = function(index) {
		var list = $scope.filteredList[index];
		console.log('backup deleting ', list);
		var msg = {
			id:list.id,
			path:list.path,
			title:list.title
		}
		$scope.isLoading = true;
		var url = "/backup/delete/" + msg.id ;
		$http({url: url, data: msg,
			method: 'POST'}).then(function successCallback(response) {
				console.log('response:', response);
				$scope.isLoading = false;
				var data = response.data;
				if(data.result == "success") { 
					console.log('backupList ', list );
					for(var j =0; j < $scope.backupList.length; j++) {
						var info = $scope.backupList[j];
						if(msg.id == info.id) {
							console.log('success file delete ' + j);
							$scope.backupList.splice(j,1);
						}
					}
					$scope.filteredList.splice(index,1);
				}
				else
					alert("Failed to delete [" + data.description +"]");
			}, function errorCallback(response) {
				$scope.isLoading = false;
		});
	};

	$scope.delete_backups = function() {
		angular.forEach(Object.keys($scope.checkboxes.items), function(item) {
			console.log('item:', item);
			for(var idx =0; idx < $scope.filteredList.length; idx++) {
				var list = $scope.filteredList[idx];
				if(item == list.id) {
					$scope.delete_backup(idx);
				}
			}
		});
	}
	$scope.resetAll = function () {
		console.log('reset file data');
		$scope.filteredList = $scope.backupList;
		$scope.searchText = '';
		$scope.currentPage = 0;
		//$scope.pagination();  
		$scope.Header = ['', '', '','','','','','']; 
	};
	$scope.list_backup = function(){
		$scope.isLoading = true;
		var url = "/backup/list" ;
		if($scope.selectedBackupId != "")
			if(!angular.isUndefined($scope.selectedBackupId))
				url = "/backup/list/" + $scope.selectedBackupId ;

		$http({url:url, method: 'GET'}).then(function successCallback(response) {
			var data = response.data.data;
			if(angular.isUndefined(data))
				return;
			$scope.backupList =[];
			console.log('backup data:(' + data.length + ")", data);
			var total_size = 0;
			var i = 0;
			for(; i < data.length ; i++){
				var list = {
					id:data[i].id,
					title:data[i].title,
					type:data[i].type,
					uploaded_by:data[i].uploaded_by,
					status:data[i].status,
					uploaded_date:data[i].uploaded_date,
				};
				$scope.backupList.push(list);
			};
			$scope.backupInput.total_size = total_size;
			$scope.backupInput.filecount = i;
			//$scope.$apply($scope.backupList);
			$scope.isLoading = false;
			$scope.resetAll();
		}, function errorCallback(response) {
			$scope.isLoading = false;
		});
	}
	$scope.list_backup();

	$scope.select_backup = function(index){
		$scope.selectedBackupId = $scope.filteredList[index].id;
		$scope.selectedBackup = $scope.filteredList[index].path;
		$scope.rootDir = false;
		$scope.list_backup();
	};

	// Calculate Total Number of Pages based on Search Result  
	$scope.sort = function (sortBy) {  
		$scope.resetAll();  
		$scope.columnToOrder = sortBy;  
		console.log('sort by:'+ sortBy);
		//$Filter - Standard Service  
		$scope.filteredList = $filter('orderBy')($scope.backupList, $scope.columnToOrder, $scope.reverse);  
	
		if ($scope.reverse) var iconName = 'glyphicon glyphicon-chevron-up';  
		else var iconName = 'glyphicon glyphicon-chevron-down';  
	
		if (sortBy === 'title') {  
			$scope.Header[0] = iconName;  
		} else if (sortBy === 'uploaded_date') {  
			$scope.Header[1] = iconName;  
		} else if (sortBy === 'type') {  
			$scope.Header[2] = iconName;  
		} else if (sortBy === 'uploaded_by') {  
			$scope.Header[3] = iconName;  
		} else {  
			$scope.Header[4] = iconName;  
		}  

		$scope.reverse = !$scope.reverse;  
		//$scope.pagination();  

	};  

	$scope.$watch('searchText', function(newValue, oldValue){
			$scope.filteredList = $filter('filter')($scope.backupList, $scope.searchText);
	});

}]);

app.controller('backupTableCtrl', ['$scope', '$http', '$timeout', '$uibModalInstance', 'Lightbox', 'items', 
function($scope, $http, $timeout, $uibModalInstance, Lightbox, items) {
	$scope.restoreTable = {
		title: ""
	};
	$scope.clear_content = function(){
		$scope.backupTable.title = '';
	};
	$scope.cancel_dialog = function(){
		console.log('dialog close');
		$uibModalInstance.close();
	};

	$scope.backup_table = function(){
		console.log('backup tables');
		var url = "/backup/create/" + $scope.backupTable.title;
		var msg = {
		};
		$http({url: url,
			method: 'POST',
			data: msg}).then(function successCallback(response) {
				console.log("restore table :", response);
				var data = response.data;
				if(data.result == "success") {
					console.log('data: ', data.data);
					$uibModalInstance.close(cont);
				} else {
					$scope.message = "Failed to backup[" + data.description + "]";
					$scope.dirInput.exist_error = true;
				}
			}, function errorCallback(response) {
				$scope.message = "Failed to backup [" + response.description + "]";
		});

	}

}]);

app.controller('restoreTableCtrl', ['$scope', '$http', '$timeout', '$uibModalInstance', 'Lightbox', 'Upload', 'items', 
function($scope, $http, $timeout, $uibModalInstance, Lightbox, Upload, items) {
	$scope.restoreTable = {
		abouthotel: false,
		dining: false,
		banner: false,
		overlayads: false,
		vod: false
	};
	$scope.clear_content = function(){
		$scope.restoreTable.abouthotel = false;
		$scope.restoreTable.dining       = false;
		$scope.restoreTable.banner       = false;
		$scope.restoreTable.overlayads       = false;
		$scope.restoreTable.vod       = false;
	};
	$scope.cancel_dialog = function(){
		console.log('dialog close');
		$uibModalInstance.close();
	};
	$scope.restore_table = function(index){
		console.log('backup restore tables');
		var backupId = $scope.filteredList[index].id;

		var url = "/backup/restore/" + backupId;
		var msg = {
			abouthotel:$scope.restoreTable.abouthotel? "ON":"OFF",
			dining: $scope.restoreTable.dining? "ON":"OFF",
			banner: $scope.restoreTable.banner? "ON":"OFF",
			overlay: $scope.restoreTable.overlay? "ON":"OFF",
			vod: $scope.restoreTable.vod? "ON":"OFF",
		};
		$http({url: url,
			method: 'POST',
			data: msg}).then(function successCallback(response) {
				console.log("restore table :", response);
				var data = response.data;
				if(data.result == "success") {
					console.log('data: ', data.data);
					$uibModalInstance.close(cont);
				} else {
					$scope.message = "Failed to restore[" + data.description + "]";
					$scope.dirInput.exist_error = true;
				}
			}, function errorCallback(response) {
				$scope.message = "Failed to restore [" + response.description + "]";
		});

	}

}]);
