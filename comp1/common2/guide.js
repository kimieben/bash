app.controller('GuideCtrl', [
  '$rootScope',
	'$scope',
	'$http',
	'Upload',
	'qbSocket',
	function($rootScope, $scope, $http, Upload, qbSocket) {
		$rootScope.currentComponent = $rootScope.currentDoc = null;

		//users
		// TODO get from DB
		var users = [{name:'master', role:'admin'}];
		var selected= null, previous = null;

		$scope.selectedIndex = 1;
		$scope.roles = [
			{type:'admin',    title:'Admin'},
			{type:'operator', title:'Operator'},
			{type:'signage',  title:'Sinage'},
			{type:'front',    title:'Front'}];

		$scope.users = users;

		$scope.addUser = function(Name, Password, Role){
			var user = {name: Name, password: Password, role: Role, disabled: false};
			for(var idx = 0;idx < users.length ; idx++){
				if(angular.equals(user.name, users[idx].name)){
					// TODO 서버로 보내기
					return;
				}
			}
			users.push(user);
		};
		$scope.removeUser = function(user){
			var index = users.indexOf(user);
			console.log(index);
			// TODO 서버에서 삭제
			users.splice(index, 1);
		};
		$scope.$watch('selectedIndex', function(current){
			previous = selected;
			selected = users[current];
		});

		//////////////////////////////////
		$scope.properties = {
			serial_number:{
				name:'serial_number',
				desc:"Serial Number"
			},
			model_name:{
				name:'model_name',
				desc:"Model Name"
			},
			micom:{
				name:'micom_version',
				desc:"Micom Version"
			},
			boot_version:{
				name:'boot_version',
				desc:"Boot Version"
			},
			platform_version: {
				name:'platform_version',
				desc:"Platform Version"
			},
			hcap_middleware_version:{
				name:'hcap_middleware_version',
				desc:"Middleware Version"
			},
			hcap_js_extension_version:{
				name:'hcap_js_extension_version',
				desc:"JS Extension Version"
			},
			hardware_version:{
				name:'hardware_version',
				desc:"Hardware Version"
			},
			display_resolution:{
				name:'display_resolution',
				desc:"Display Resolution"
			},
			osd_layer_id:{
				name:'osd_layer_id',
				desc:"ID of HCAP OSD layer"
			},
			number_of_tunner:{
				name:'number_of_tuner',
				desc:"Number of Tuner"
			},
			max_app_size:{
				name:'max_application_size',
				desc:"Max App Size"
			},
			cache_size:{
				name:'max_content_cache_size',
				desc:"Max Cache Size"
			},
			country:{
				name:'country',
				desc:"Country"
			},
			lang:{
				name:'language',
				desc:"Language"
			},
			decoder:{
				name:'single_decoding',
				desc:"Single Decoding"
			}
		};

		// devices
		$scope.devices = DeviceList;
		angular.forEach($scope.devices, function(device){
      device.nic = new Array(2);
      device.sdk = '';
      device.middleware = '';

      device.msgs = []; //TODO 서버에서 받아야!!?

      device.volume = -1;
      device.channel = {
        current:"",
        start:""
      };

      device.picture = {
        backlight:{
          name:'BACKLIGHT',
          value:''
        },	
        contrast:{
          name:'CONTRAST',
          value:''
        },	
        brightness:{
          name:'BRIGHTNESS',
          value:''
        },	
        sharpness:{
          name:'SHARPNESS',
          value:''
        },	
        color:{
          name:'COLOR',
          value:''
        },	
        tint:{
          name:'TINT',
          value:''
        },	
        color_temperature:{
          name:'COLOR_TEMPERATURE',
          value:''
        }	
      };

      device.soft_ap = {
        net:{},
        enable:{
          name:'soft_ap',
          desc:"Soft AP",
          value:-1
        },
        ssid:{
          name:'tv_name',
          desc:"SSID",
          value:""
        },
        passwd:{
          name:'soft_ap_password',
          desc:"Password",
          value:""
        },
        auto_enable:{
          name:'auto_enable',
          desc:"SoftAP Auto-Enable",
          value:-1
        },
        pwd_type:{
          name:'pwd_type',
          desc:"Auto Generating Passowrd",
          value:-1
        }
      };

      device.properties = {
        readonly:{
          serial_number:{
            name:'serial_number',
            desc:"Serial Number",
            value:""
          },
          model_name:{
            name:'model_name',
            desc:"Model Name",
            value:""
          },
          micom:{
            name:'micom_version',
            desc:"Micom Version",
            value:""
          },
          boot_version:{
            name:'boot_version',
            desc:"Boot Version",
            value:""
          },
          platform_version: {
            name:'platform_version',
            desc:"Platform Version",
            value:""
          },
          hcap_middleware_version:{
            name:'hcap_middleware_version',
            desc:"Middleware Version",
            value:""
          },
          hcap_js_extension_version:{
            name:'hcap_js_extension_version',
            desc:"JS Extension Version",
            value:""
          },
          hardware_version:{
            name:'hardware_version',
            desc:"Hardware Version",
            value:""
          },
          display_resolution:{
            name:'display_resolution',
            desc:"Display Resolution",
            value:""
          },
          osd_layer_id:{
            name:'osd_layer_id',
            desc:"ID of HCAP OSD layer",
            value:""
          },
          number_of_tunner:{
            name:'number_of_tuner',
            desc:"Number of Tuner",
            value:""
          },
          max_app_size:{
            name:'max_application_size',
            value:""
          },
          cache_size:{
            name:'max_content_cache_size',
            value:""
          },
          country:{
            name:'country',
            value:""
          },
          lang:{
            name:'language',
            value:""
          },
          decoder:{
            name:'single_decoding',
            value:""
          }
        },
        rw:{
          instant_power:{
            name:'instant_power',
            value:-1
          },
          boot_sequence_option:{
            name:'boot_sequence_option',
            value:-1
          },
          tv_volume_ui:{
            name:'tv_volume_ui',
            value:-1
          },
          tv_floating_ui:{
            name:'tv_channel_attribute_floating_ui',
            value:-1
          },
          tv_channel_ui:{
            name:'tv_channel_ui',
            value:-1
          },
          tv_channel_lock:{
            name:'channel_lock',
            value:-1
          },
          app_launcher_ui:{
            name:'tv_preloaded_app_launcher_ui',
            value:-1
          },
          tv_channel_control:{
            name:'tv_channel_control',
            value:-1
          },
          app_channel_control:{
            name:'application_channel_control',
            value:-1
          },
          inband_mhp:{
            name:'inband_data_service_mhp',
            value:-1
          },
          inband_mheg:{
            name:'inband_data_service_mheg',
            value:-1
          },
          inband_hbbtv:{
            name:'inband_data_service_hbbtv',
            value:-1
          },
          screen_share:{ 
            name:'wifi_screen_share',
            value:-1
          },
          smart_share:{
            name:'smart_share',
            value:-1
          },
          dmr:{
            name:'dmr',
            value:-1
          },
          smart_pairing:{
            name:'smart_pairing',
            value:-1
          },
          caption:{
            name:'tv_caption_ui',
            value:-1
          },
          simplink:{
            name:'key_delivery_to_simplink',
            value:-1
          },
          wol_magic:{
            name:'wol_m',
            value:""
          },
          wol_wakeup:{
            name:'wol_w',
            value:""
          },
          security:{
            name:'security_level',
            value:-1,
          },
          browser_error:{
            name:'browser_network_error_handling',
            value:-1,
          },
          browser_https_level:{
            name:'browser_https_security_level',
            value:-1,
          },
          pcr_recovery:{
            name:'pcr_recovery',
            value:-1,
          },
          mute_tv_input:{
            name:'mute_on_tv_input',
            value:-1
          },
          start_page_url:{
            name:'full_browser_start_page_url',
            value:"",
          },
          power_mode:""
        }
      };
    });

		function get_id(device){
			device.status = "";
			qbSocket.device.id(device);
		}

		$scope.get_id_all = function(){
			angular.forEach($scope.devices, function(device){
				//if(device.checked)
					get_id(device);
			});
		};

		$scope.floorList = [];

		$scope.$on('room_device', function(event, msg){
			for(var idx=0; idx < msg.length; idx++){
				console.log(msg[idx]);
				var src = msg[idx];

				for(var idx2=0; idx2 < $scope.devices.length; idx2++){
					var device = $scope.devices[idx2];
					if(src.room == device.name){
						console.log(src.room, device.name);

						if(angular.equals(src.type, 'signage')){
							device.qsign=true;
						}

						var floorNum = src.where.floor;
						if($scope.floorList.indexOf(floorNum) < 0)
							$scope.floorList.push(floorNum);
						device.floor = floorNum;

						device.room_type = {
							type:src.where.type,
							where:src.where.direction
						};

						device.sn			= src.sn,
						device.mac		= src.mac,
						device.model	= src.model,
						device.type		= src.type,

						// get_id(device); // disable to send id packet, get from table first

						console.log(device);

						break;
					}
				}
			}

			$scope.$apply($scope.devices);

		});

		// logo
		$scope.logo = {list:LogoList, selected:LogoSelected};

		// $scope.$watch('files', function(){
		// 	$scope.logo_upload($scope.files);
		// });

		// $scope.logo_upload = function(files){
		// 	if(files && files.length){
		// 		for(var i = 0; i < files.length; i++){
		// 			var file = files[i];
		// 			Upload.upload({ url:'//upload.logo', fields:{'title':$scope.logo.title}, file:file })
		// 				.progress(onProgress)
		// 				.success(onSuccess)
		// 				.error(onError);
		// 		}
    //   }
    //   function onProgress(evt) {
    //     var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //     console.log('progress:' + progressPercentage + '% ' + evt.config.file.name);
    //   }
    //   function onSuccess(data, status, headers, config){
    //     console.log('file ' + config.file.name + ' uploaded. Response: ' + angular.fromJson(data));
    //     $scope.logo.list.push({title:$scope.logo.title, src:config.file.name});
    //   }
    //   function onError(data, status, headers, config){
    //     console.log('error status: ' + status);
    //   }
		// };
		// $scope.submit_logo= function(){
		// 	var msg = {
		// 		'type':'logo',
		// 		'action':'submit',
		// 		'logo':$scope.logo.selected
		// 	};

		// 	$scope.logo.circle = true;
		// 	$http.post('/qcb/cfg.tvApp', msg)
		// 		.then(function success(response){
		// 			$scope.logo.circle = false;
		// 		}, function error(response){
		// 			$scope.logo.circle = false;
		// 			$scope.showAlert();
		// 		});
		// };
		// $scope.remove_logo= function(){
		// 	var msg = {
		// 		'type':'logo',
		// 		'action':'remove',
		// 		'logo':$scope.logo.selected
		// 	};

		// 	$scope.logo.circle = true;
		// 	$http.post('/qcb/cfg.tvApp', msg)
		// 		.then(function success(response){
		// 			$scope.logo.circle = false;
		// 			var index = $scope.logo.list.indexOf({src:$scope.logo.selected});
		// 			$scope.logo.list.splice(index, 1);
		// 		}, function error(response){
		// 			$scope.logo.circle = false;
		// 			$scope.showAlert();
		// 		});
		// };

		// ch_icon
		$scope.ch_icon = {list:ChIconList};

		// $scope.$watch('ch_icon_files', function(){
		// 	$scope.ch_icon_upload($scope.ch_icon_files);
		// });

		// $scope.ch_icon_upload = function(files){
		// 	if(files && files.length){
		// 		for(var i = 0; i < files.length; i++){
		// 			var file = files[i];
		// 			Upload.upload({ url:'/qcb/upload.ch_icon', fields:{'title':$scope.ch_icon.title}, file:file })
		// 				.progress(onProgress)
		// 				.success(onSuccess)
		// 				.error(onError);
		// 		}
    //   }
    //   function onProgress(evt){
    //     var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //     console.log('progress:' + progressPercentage + '% ' + evt.config.file.name);
    //   }
    //   function onSuccess(data, status, headers, config){
    //     console.log('file ' + config.file.name + ' uploaded. Response: ' + angular.fromJson(data));
    //     $scope.ch_icon.list.push({title:$scope.ch_icon.title, src:config.file.name});
    //   }
    //   function onError(data, status, headers, config){
    //     console.log('error status: ' + status);
    //   }

		// };
		// $scope.remove_ch_icon= function(){
		// 	var msg = {
		// 		'type':'ch_icon',
		// 		'action':'remove',
		// 		'ch_icon':$scope.ch_icon.selected
		// 	};

		// 	$scope.ch_icon.circle = true;
		// 	$http.post('/qcb/cfg.tvApp', msg)
		// 		.then(function success(response){
		// 			$scope.ch_icon.circle = false;
		// 			var index = $scope.ch_icon.list.indexOf({src:$scope.ch_icon.selected});
		// 			$scope.ch_icon.list.splice(index, 1);
		// 		}, function error(response){
		// 			$scope.ch_icon.circle = false;
		// 			$scope.showAlert();
		// 		});
		// };

		//alert
		$scope.showAlert = function(){
			$mdDialog.show(
					$mdDialog.alert()
					.parent(angular.element(document.body))
					.title('Error!!')
					.content('Fail to apply.')
					.ariaLabel('Alert Dialog')
					.ok('Got it')
			);
		};
}]);
