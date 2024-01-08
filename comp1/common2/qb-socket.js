// qb-socket.js

(function() {
	'use strict';

	angular
		.module('star.base')
		.factory('qbSocket', qbSocket);

	qbSocket.$inject = [
		'$rootScope',
		'$timeout'
	];

	function qbSocket(
		$rootScope,
		$timeout) {
		
		var service = {
			vsn  : api_version,
			send : ws_send,

			// TODO: Move to qb_xxx.js
			admin : {
				join : admin_join
			},
			message : {
				add    : message_add,
				remove : message_remove,
				clear  : message_clear
			},
			advertise : {
				refresh : advertise_refresh,
				insert  : advertise_insert,
				delete  : advertise_delete,
				modify  : advertise_modify,
				list    : advertise_list,
				add     : advertise_add,
				remove  : advertise_remove
			},
			emergency : {
				on  : emergency_on,
				off : emergency_off
			},
			patientBoard : {
				update : patientboard_update
			},
			device : {
				id               : device_id,
				platform         : device_platform,
				
				powerMode        : device_power_mode,
				setPowerMode     : device_set_power_mode,
				powerOff         : device_power_off,
				powerOn          : device_power_on,
				reboot           : device_reboot,

				volumeLevel      : device_volume,
				setVolumeLevel   : device_set_volume,

				debug_console    : device_debug_console,
				http_rms         : device_http_rms,

				property         : device_property,
				setProperty      : device_set_property,
		
				restartApp       : device_restart_app,
				updateApp        : device_update_app,
				removeApp        : device_remove_app,

				downloadFirmware : device_download_firmware,
				upgradeFirmware  : device_upload_firmware,

				setKeyPermission : device_set_key_permission,
				resetTVSettings  : device_reset_setting
			},
			channel : {
				updateChannelMap : channel_update_map,
				channel          : channel_get,
				setChannelUp     : channel_up,
				setChannelDown   : channel_down,
				setChannel       : channel_set,
				setChannelNum    : channel_set_num,
				setStartChannel  : channel_set_boot,
				getStartChannel  : channel_boot,

				list       : channel_list,
				info       : channel_info,
				info_list  : channel_info_list,
				state      : channel_state,
				state_list : channel_state_list,
				pkg_list   : channel_pkg_list,
				pkg_now    : channel_pkg_now,
				pkg_set    : channel_pkg_set
			},
			signage : {
				setTileInfo  : sigange_set_tileinfo,
				setTileMode  : signage_set_tilemode,
				setInput     : signage_input_set,
				inputChange  : signage_input_change
			},
			input : {
				getExternalInput : input_external,
				setExternalInput : input_set_external,
			},
			rs232 : {
				setTileInfo : rs232_set_tileinfo,
				setInput    : rs232_set_input,
				setTileMode : rs232_set_tilemode,
				inputChange : rs232_input_change,
				powerOff    : rs232_power_off,
				powerOn     : rs232_power_on
			},
			softap : {
				softAP        : softap_get,
				softAPNet     : softap_get_net,
				setSoftAP     : softap_set,
				setSoftAPNet  : softap_set_net,

				setEnable     : softap_set_enable,
				setSSID       : softap_set_ssid,
				setPasswd     : softap_set_passwd,
				setPasswdType : softap_set_passwd_type,
				setAutoEnable : softap_set_auto_enable
			},
			network : {
				netInfo      : network_info,
				netDevice    : network_device,
				setNetDevice : network_set_device
			},
			screen : {
				pictureProperty    : screen_property,
				setPictureProperty : screen_set_property,
				brightnessLevel    : screen_brightness,
				setBrightnessLevel : screen_set_brightness
			},
			room : {
				room_device   : room_device,
				setRoomType   : room_set_type,
				setRoomNumber : room_set_name,

				checkIn       : room_check_in,
				checkOut      : room_check_out
			}
		};

		var chList = [];

		var ws_is_opened = false;
		var ws;
		var ws_timer = null;
		var ws_url = websocket_url + "procentric";

		activate();
		return service;

		///////////////////////////////////////////////
		function activate() {
			initialize_websocket();
		}

		//// admin 
		function admin_join() {
			ws_send({
				type:'admin',
				cmd:'join',
				from: 'webgui'
			});
		}

		//// message
		function message_add(Device, Msg) {
			ws_send({
				type: "message",
				cmd: "add",
				id:Msg.id,
				title:Msg.title,
				data:Msg.data,
				issued:Msg.issued,
				branch: Device.branch,
				room: Device.room
			});
		}
		function message_remove(Device, Msg) {
			ws_send({
				type: "message",
				cmd: "remove",
				id:Msg.id,
				title:Msg.title,
				issued:Msg.issued,
				branch: Device.branch,
				room: Device.room
			});
		}
		function message_clear(Device) {
			ws_send({
				type: "message",
				cmd: "clear",
				branch: Device.branch,
				room: Device.room
			});	
		}

		//// advertise
		function advertise_refresh(Device, Data) {
			console.log('refresh: ',Data);
			ws_send({
				type: "advertise",
				cmd: "refresh",
				branch: Device.branch,
				data: Data
			});
		}
		function advertise_insert(Device, Data) {
			ws_send({
				type: "advertise",
				cmd: "insert",
				branch: Device.branch,
				data: Data
			});
		}
		function advertise_delete(Device, Data) {
			ws_send({
				type: "advertise",
				cmd: "delete",
				branch: Device.branch,
				data: Data
			});
		}
		function advertise_modify(Device, Data) {
			ws_send({
				type: "advertise",
				cmd: "modify",
				branch: Device.branch,
				data: Data
			});
		}
		function advertise_list(Device) {
			ws_send({
				type: "advertise",
				cmd: "list",
				branch: Device.branch,
			});
		}
		function advertise_add(Device, Data) {
			ws_send({
				type: "advertise",
				cmd: "add",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function advertise_remove(Device, Data) {
			ws_send({
				type: "advertise",
				cmd: "remove",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}

		//// emergency
		function emergency_on(Device) {
			ws_send({
				type: "emergency",
				cmd: "on",
				branch: Device.branch,
				room: Device.room
			});
		}
		function emergency_off(Device) {
			ws_send({
				type: "emergency",
				cmd: "off",
				branch: Device.branch,
				room: Device.room
			});
		}

		//// patientBoard
		function patientboard_update(Device) {
			ws_send({
				type: "boardUpdate",
				branch: Device.branch,
				room: Device.room
			});
		}

		//// device
		function device_id(Device) {
			ws_send({
				type: "remote",
				cmd: "id",
				branch: Device.branch,
				room: Device.room
			});
		}
		function device_platform(Device) {
			ws_send({
				type: "remote",
				cmd: "platform",
				branch: Device.branch,
				room: Device.room
			});
		}
		function device_power_mode(Device) {
			ws_send({
				type: "remote",
				cmd: "powerMode",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_set_power_mode(Device, mode) {
			ws_send({
				type: "remote",
				cmd: "setPowerMode",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				data: mode
			});
		}
		function device_power_off(Device) {
			ws_send({
				type: "remote",
				cmd: "powerOff",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_power_on(Device) {
			ws_send({
				type: "remote",
				cmd: "powerOn",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				mac: Device.mac
			});
		}
		function device_reboot(Device) {
			ws_send({
				type: "remote",
				cmd: "reboot",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_volume(Device) {
			ws_send({
				type: "remote",
				cmd: "volume",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_set_volume(Device, Level) {
			ws_send({
				type: "remote",
				cmd: "setVolume",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				level: Level
			});
		}
		function device_debug_console(Device, OnOff) {
			ws_send({
				type: "debug_console",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				on_off: OnOff
			});
		}
		function device_http_rms(Device, Cmd) {
			ws_send({
				type: "http_rms",
				branch: Device.branch,
				room: Device.room,
				cmd: Cmd
			});
		}
		function device_property(Device, Key) {
			ws_send({
				type: "remote",
				cmd: "property",
				branch: Device.branch,
				room: Device.room,
				key: Key
			});
		}
		function device_set_property(Device, Key, Value) {
			ws_send({
				type: "remote",
				cmd: "setProperty",
				branch: Device.branch,
				room: Device.room,
				key: Key,
				value: Value
			});
		}
		function device_restart_app(Device) {
			ws_send({
				type: "remote",
				cmd: "restartApp",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_update_app(Device) {
			ws_send({
				type: "remote",
				cmd: "updateApp",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_remove_app(Device) {
			ws_send({
				type: "remote",
				cmd: "removeApp",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_download_firmware(Device) {
			ws_send({
				type: "remote",
				cmd: "copyFw",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function device_upload_firmware(Device) {
			ws_send({
				type: "remote",
				cmd: "upgradeFw",
				branch: Device.branch,
				room: Device.room
			});
		}
		function device_set_key_permission(Device, Data) {
			ws_send({
				type: "remote",
				cmd: "keyPermission",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				data: Data
			});
		}
		function device_reset_setting(Device) {
			ws_send({
				type: "remote",
				cmd: "resetTVSettings",
				branch: Device.branch,
				room: Device.room
			});
		}

		//// channel
		function channel_update_map(Device) {
			ws_send({
				type: "remote",
				cmd: "updateChannelMap",
				branch: Device.branch,
				room: Device.room
			});
		}
		function channel_get(Device) {
			ws_send({
				type: "remote",
				cmd: "channel",
				branch: Device.branch,
				room: Device.room
			});
		}
		function channel_up(Device) {
			ws_send({
				type: "remote",
				cmd: "setChannelUp",
				branch: Device.branch,
				room: Device.room
			});
		}
		function channel_down(Device) {
			ws_send({
				type: "remote",
				cmd: "setChannelDown",
				branch: Device.branch,
				room: Device.room,
			});
		}
		function channel_set(Device, Name) {
			ws_send({
				type: "remote",
				cmd: "setChannel",
				branch: Device.branch,
				room: Device.room,
				channel: Name
			});
		}
		function channel_set_num(Device, ChannelNum) {
			ws_send({
				type: "remote",
				cmd: "setChannelNum",
				branch: Device.branch,
				room: Device.room,
				chNum: ChannelNum
			});
		}
		function channel_set_boot(Device, Name) {
			ws_send({
				type: "remote",
				cmd: "setStartChannel",
				branch: Device.branch,
				room: Device.room,
				channel: Name
			});
		}
		function channel_boot(Device) {
			ws_send({
				type: "remote",
				cmd: "getStartChannel",
				branch: Device.branch,
				room: Device.room
			});
		}
		function channel_list(Branch) {
			ws_send({
				type: "list",
				branch: Branch,
			});
		}
		function channel_info(Branch, name) {
			ws_send({
				type: "info",
				branch: Branch,
				channel: name
			});
		}
		function channel_info_list(Branch) {
			for(var idx=0; idx < chList.length ; idx++){
				channel_info(Branch, chList[idx].name);
			}
		}
		function channel_state(Branch, name) {
			ws_send({
				type: "state",
				branch: Branch,
				channel: name
			});
		}
		function channel_state_list(Branch) {
			for(var idx=0; idx < chList.length ; idx++){
				channel_state(Branch, chList[idx].name);
			}
		}
		function channel_pkg_list(Branch) {
			ws_send({
				type: "ch_pkg",
				cmd: "list",
				branch: Branch,
			});
		}
		function channel_pkg_now(Device) {
			ws_send({
				type: "ch_pkg",
				cmd: "now",
				branch: Device.branch,
				room: Device.room
			});
		}
		function channel_pkg_set(Device, Value) {
			ws_send({
				type: "ch_pkg",
				cmd: "set",
				branch: Device.branch,
				room: Device.room,
				pkg: Value
			});
		}

		//// signage
		function sigange_set_tileinfo(Device, Data) {
			ws_send({
				type: "signage",
				cmd: "setTileInfo",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function signage_input_set(Device, Data) {
			ws_send({
				type: "signage",
				cmd: "setInput",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function signage_input_change(Device, Input, Port) {
			ws_send({
				type: "remote",
				cmd: "inputChange",
				branch: Device.branch,
				room: Device.room,
				src: Input,
				port: Port
			});
		}
		function signage_set_tilemode(Device, Data) {
			ws_send({
				type: "remote",
				cmd: "setTileMode",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}

		//// input
		function input_external(Device) {
			ws_send({
				type: "remote",
				cmd: "getExternalInput",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}
		function input_set_external(Device, Input) {
			ws_send({
				type: "remote",
				cmd: "setExternalInput",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				input: Input
			});
		}

		//// rs232
		function rs232_set_tileinfo(Device, Data) {
			ws_send({
				type: "lg232",
				cmd: "setTileInfo",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function rs232_set_input(Device, Data) {
			ws_send({
				type: "lg232",
				cmd: "setInput",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function rs232_set_tilemode(Device, Data) {
			ws_send({
				type: "lg232",
				cmd: "setTileMode",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function rs232_input_change(Device, Input, Port) {
			ws_send({
				type: "lg232",
				cmd: "inputChange",
				branch: Device.branch,
				room: Device.room,
				src: Input,
				port: Port
			});
		}
		function rs232_power_off(Device) {
			ws_send({
				type: "lg232",
				cmd: "powerOff",
				branch: Device.branch,
				room: Device.room,
			});
		}
		function rs232_power_on(Device) {
			ws_send({
				type: "lg232",
				cmd: "powerOn",
				branch: Device.branch,
				room: Device.room,
				mac: Device.mac
			});
		}

		//// softap
		function softap_get(Device, Key) {
			ws_send({
				type: "remote",
				cmd: "softAP",
				branch: Device.branch,
				room: Device.room,
				key: Key
			});
		}
		function softap_get_net(Device, Refresh) {
			ws_send({
				type: "remote",
				cmd: "softAPNet",
				branch: Device.branch,
				room: Device.room,
				refresh: Refresh
			});
		}
		function softap_set(Device, Key, Value) {
			ws_send({
				type: "remote",
				cmd: "setSoftAP",
				branch: Device.branch,
				room: Device.room,
				key: Key,
				value: Value
			});
		}
		function softap_set_net(Device, Data) {
			ws_send({
				type: "remote",
				cmd: "setSoftAPNet",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function softap_set_enable(Device, Data) {
			ws_send({
				type: "softap_set",
				cmd: "soft_ap",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function softap_set_ssid(Device, Data) {
			ws_send({
				type: "softap_set",
				cmd: "ssid",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function softap_set_passwd(Device, Data) {
			ws_send({
				type: "softap_set",
				cmd: "passwd",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function softap_set_passwd_type(Device, Data) {
			ws_send({
				type: "softap_set",
				cmd: "pwd_type",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function softap_set_auto_enable(Device, Data) {
			ws_send({
				type: "softap_set",
				cmd: "auto_enable",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}

		//// network
		function network_info(Device, Refresh) {
			ws_send({
				type: "remote",
				cmd: "netInfo",
				branch: Device.branch,
				room: Device.room,
				refresh: Refresh
			});
		}
		function network_device(Device, Refresh, Idx) {
			ws_send({
				type: "remote",
				cmd: "netDevice",
				branch: Device.branch,
				room: Device.room,
				refresh: Refresh,
				idx: Idx
			});
		}
		function network_set_device(Device, Idx, Data) {
			ws_send({
				type: "remote",
				cmd: "setNetDevice",
				branch: Device.branch,
				room: Device.room,
				idx: Idx,
				data: Data
			});
		}

		//// screen
		function screen_property(Device, Key) {
			ws_send({
				type: "remote",
				cmd: "pictureProperty",
				branch: Device.branch,
				room: Device.room,
				key: Key
			});
		}
		function screen_set_property(Device, Key, Value) {
			ws_send({
				type: "remote",
				cmd: "setPictureProperty",
				branch: Device.branch,
				room: Device.room,
				key: Key,
				value: parseInt(Value)
			});
		}
		function screen_brightness(Device) {
			ws_send({
				type: "remote",
				cmd: "brightness",
				branch: Device.branch,
				room: Device.room
			});
		}
		function screen_set_brightness(Device, Level) {
			ws_send({
				type: "remote",
				cmd: "setBrightness",
				branch: Device.branch,
				room: Device.room,
				level: Level
			});
		}

		//// room
		function room_device(Device) {
			ws_send({
				type: "remote",
				cmd: "room_device",
				branch: Device.branch
			});
		}
		function room_set_type(Device, Data) {
			ws_send({
				type: "remote",
				cmd: "setRoomType",
				branch: Device.branch,
				room: Device.room,
				data: Data
			});
		}
		function room_set_name(Device, New) {
			ws_send({
				type: "remote",
				cmd: "setRoomNumber",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				new_room: New
			});
		}
		function room_check_in(Device, User) {
			let msg = {
				type: "account",
				cmd: "add",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name,
				user: User
			};
			console.log('room_check_in', msg);
			ws_send(msg);
		}
		function room_check_out(Device) {
			ws_send({
				type: "remote",
				cmd: "checkOut",
				branch: Device.branch,
				room: Device.room? Device.room: Device.name
			});
		}

		//// websocket
		function api_version() {
			return "1.0.0";
		}
		function init_ws(Timeout){
			if(ws_timer != null){
				$timeout.cancel(ws_timer);
				ws_timer = null;
			}
			ws_timer = $timeout(function(){
				initialize_websocket();
			}, Timeout);
		}

		function initialize_websocket() {
			console.log("[base.websocket initialize]");

			ws = null;
			// FIXME: get from the server...
			ws = new WebSocket(ws_url);

			ws.onmessage = ws_onMessage;
			ws.onopen    = ws_onOpen;
			ws.onclose   = ws_onClose;
		}

		function ws_onMessage(e) {
			var msg = JSON.parse(e.data);
			// console.log("[base.websocket:"+msg.type+"]", msg);

			switch(msg.type){
				case "signage_resp":
					break;

				case "inputSrc_resp":
					$rootScope.$broadcast('inputSrc_resp', msg);
					break;

				case "keyPermission_resp":
					$rootScope.$broadcast('keyPermission_resp', msg);
					break;

				case "cdn_resp":
					switch(msg.cmd){
						case "cp":
							$rootScope.$broadcast('cdn_resp_cp', msg);
							break;

						case "mv":
							break;

						case "rm":
							$rootScope.$broadcast('cdn_resp_rm', msg);
							break;

						case "read":
							break;

						case "stat":
							break;

						case "exist":
							break;

						case "list":
							$rootScope.$broadcast('cdn_resp_list', msg);
							break;

						case "unzip":
							break;

						case "mkdir":
							break;

						case "fsync":
							break;

						case "storage":
							break;

							/////////////////////////////
						case "copyFw":
							break;

						case "upgradeFw":
							break;

						case "upgradeStatusFw":
							break;

							/////////////////////////////
						case "restartApp":
							break;

						case "updateApp":
							break;

						case "removeApp":
							break;

							/////////////////////////////
						case "splashImg":
							break;

						default:
							break;
					}
					break;

				case "resp":
					switch(msg.cmd){
						case "account":
							$rootScope.$broadcast('resp_account', msg);
							break;

						case "platform":
							$rootScope.$broadcast('resp_platform', msg);
							break;

						case "netInfo":
							$rootScope.$broadcast('resp_netInfo', msg);
							break;
						case "netDevice":
							$rootScope.$broadcast('resp_netDev', msg);
							break;
						case "setNetDevice":
							$rootScope.$broadcast('resp_setNetDev', msg);
							break;
						case "softAPNet":
							$rootScope.$broadcast('resp_softAPNet', msg);
							break;
						case "setSoftAPNet":
							$rootScope.$broadcast('resp_setSoftAPNet', msg);
							break;

						case "volume":
							$rootScope.$broadcast('resp_volume', msg);
							break;

						case "brightness":
							$rootScope.$broadcast('resp_brightness', msg);
							break;
						//TODO external input
						case "getExternalInput":
							$rootScope.$broadcast('resp_getExternalInput', msg);
							break;

						case "channel":
							$rootScope.$broadcast('resp_channel', msg);
							break;

						case "getStartChannel":
							$rootScope.$broadcast('resp_start_channel', msg);
							break;

						case "property":
							if(angular.equals(msg.key,'soft_ap') ||
								 angular.equals(msg.key,'auto_enable') ||
								 angular.equals(msg.key,'tv_name') ||
								 angular.equals(msg.key,'soft_ap_password') ||
								 angular.equals(msg.key,'pwd_type'))
								$rootScope.$broadcast(msg.key, msg.value, msg.room);
							else{
								$rootScope.$broadcast('resp_property', msg);
							}
							break;

						case "pictureProperty":
							$rootScope.$broadcast('resp_picture_property', msg);
							break;

						case "powerMode":
							$rootScope.$broadcast('resp_power_mode', msg);
							break;

						default:
							break;
					}
					break;

				case "ch_pkg":
					switch(msg.cmd){
						case "list":
							$rootScope.$broadcast('ch_pkg_list', msg.data);
							break;
						case "now":
							$rootScope.$broadcast('ch_pkg_now', msg.now);
							break;
						case "set":
							break;

						default:
							break;
					}
					break;

				case "error":
					console.log(msg.data);
					break;

				case "log":
					$rootScope.$broadcast('log', msg.data);
					break;

				case "http_rms":
					$rootScope.$broadcast('http_rms', msg);
					break;

				case "id":
					$rootScope.$broadcast('id', msg);
					break;

				case "room_device":
					//$rootScope.$broadcast('room_device', msg);
					// console.log('broadcast room_device:', msg.data)	// KC
					// need to ssave localstorage
					$rootScope.$broadcast('room_device', msg.data);
					break;

				case "tv_status":
					$rootScope.$broadcast('tv_status', msg.data);
					break;

				case "rms":
					$rootScope.$broadcast('power_status', msg);
					break;

				case "advertise":
					switch(msg.cmd){
						case 'list':
							$rootScope.$broadcast('advertise_list', msg.data);
							break;
						default:
							break;
					}
					break;

				default:
					break;
			}
		}

		function ws_onOpen(e) {
			console.log("[base.websocket opened]");
			ws_is_opened = true;

			admin_join();

			// TODO: call room_device for all Branches.
			$timeout(function(){
				room_device("paradiam");
			}, 2000);
		}

		function ws_onClose(e) {
			console.log("[base.websocket closed]");
			ws_is_opened = false;

			init_ws(5000);
		}

		function ws_send(msg){
			if(!ws_is_opened){
				console.error("[base.websocket is not opened]");

				init_ws(1000);
			}else{
				try{
					ws.send(JSON.stringify(msg));
				}catch(exception){
					console.error(exception);

					ws_is_opened = false;
					ws.close();

					init_ws(1000);
				}
			}
		}
	}

})();
