// filter.service.js

(function() {
	'use strict';
	angular
		.module('star.base')
		.factory('filteredService', filteredService);

	filteredService.$inject = [];

	function filteredService(){
		var service = {
			searched: searched,
			paged: paged
		};

		return service;
		//////////////////////////////////////////////////////
		function searched(valLists, toSearch) {
			return _.filter(valLists,  function (i) {  
					/* Search Text in all 3 fields */ 
					return searchUtil(i, toSearch);  
			}); 
		}

		function paged(valLists, pageSize) {
			console.log('lists:' + valLists.length  + ' page size:' + pageSize);
			var retVal = [];  
			for (var i = 0; i < valLists.length; i++) {  
				if (i % pageSize === 0) {  
						retVal[Math.floor(i / pageSize)] = [valLists[i]];  
				} else {  
						retVal[Math.floor(i / pageSize)].push(valLists[i]);  
				}  
			}  
			return retVal;  
		}
		//////////////////////////////////////////////////////
		function searchUtil(item, toSearch) {  
			return (item.title.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 ) ? true : false;  
		}
	}
})();
