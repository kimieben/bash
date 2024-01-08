// dialog.controller.js

(function() {
	'use strict';

	angular
		.module('star')
		.controller('dialogCtrl', dialogCtrl);

	dialogCtrl.$inject = [
		'$log',
		'$scope',
		'$mdDialog'
	];

	function dialogCtrl(
		$log,
		$scope,
		$mdDialog
	) {

		/*jshint validthis: true */
		var vm = this;

		$scope.showAdvanced = showAdvanced;

		activate();
		/////////////////////////
		function activate() {
			$scope.status = '  ';
		}

		function showAdvanced(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'dialog.tmpl.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: false
			})
			.then(function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					$scope.status = 'You cancelled the dialog.';
			});
		}

		function DialogController($scope, $mdDialog) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
			$scope.cancel = function() {
				$mdDialog.cancel();
			};
			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}
	}

})();
