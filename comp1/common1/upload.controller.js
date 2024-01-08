app.controller('uploadToServerController', ['$scope', '$http', 'Upload',
function($scope, $http, Upload) {

	$scope.uploading = {video:false, image:false, data:false};
	$scope.content_type = 'video';

	function updateList(old, added){
		var i;
		if(old.length == 0){
			for(i = 0; i < added.length; i++)
				old.push(added[i]);
		}else{
			for(i = 0 ; i < added.length ; i++){
				var file = added[i];
				var idx = 0;
				for(idx = 0 ; idx < old.length; idx++){
					if(angular.equals(old[idx].file.name, file.file.name)){ 
						old.splice(idx, 1, file);
						break;
					}
				}

				if(idx == old.length){
					old.push(file);
					break;
				}
			}
		}
	}

	function removeFile(list, filename){
		if(list.length > 0){
			for(var idx = 0 ; idx < list.length; idx++){
				if(angular.equals(list[idx].file.name, filename)){ 
					list.splice(idx, 1);
					break;
				}
			}
		}
	}

	$scope.getList = function(){
		$http.get('/epg/event')
			.then(function success(response){
				var data = response.data;
				console.log(data);
				$scope.contents.list.video = [];
				$scope.contents.list.image = [];
				$scope.contents.list.data  = [];

				updateList($scope.contents.list.video, data.video);
				updateList($scope.contents.list.image, data.image);
				updateList($scope.contents.list.data,  data.data);
			},function error(response){
				console.log('error. get server.file');
			});
	};

	$scope.deleteFromServer = function(Type, File){
		console.log('delete file ' , Type, ' ', File);

		$http.post('/qcb/server.file/delete/' + Type, File)
			.then(
				function success(response) {
					console.log(response);
					var data = response.data;
					var file = data.file;

					if(data.type == 'video'){
						removeFile($scope.contents.list.video, file);
					}else if(data.type == 'image'){
						removeFile($scope.contents.list.image, file);
					}else{
						removeFile($scope.contents.list.data, file);
					}
				},
				function error(response) {
					console.log('error. delete server.file : ', File);
			});
	};

	$scope.uploadToServer = function(File){
		console.log(File);

		if(!angular.equals(File, null)){
			var Data = {file: File, 'type': $scope.content_type, progress:0};

			//
			if(Data.type == 'video'){
				$scope.uploading.video = true;
				updateList($scope.contents.list.video, [Data]);
			}else if(Data.type == 'image'){
				$scope.uploading.image= true;
				updateList($scope.contents.list.image, [Data]);
			}else{
				$scope.uploading.data= true;
				updateList($scope.contents.list.data, [Data]);
			}

			//
			var upload = Upload.upload({
				url:'/qcb/upload.toServer',
				data:Data,
				resumeChunkSize:'10MB'
			});

			upload.then(function (resp) {
				console.log('Success ', resp.config.data.file.name, ' uploaded. Response: ', resp.data);

				if(resp.config.data.type == 'video'){
					$scope.uploading.video = false;
				}else if(resp.config.data.type == 'image'){
					$scope.uploading.image = false;
				}else{
					$scope.uploading.data = false;
				}

			}, function (resp) {
				console.log('Error status: ' + resp.status);
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			});

			$scope.abort = function(){
				upload.abort();
			};
		}
	};
}]);
