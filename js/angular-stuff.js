angular.module('clavisApp', [])
.controller('superheroCtrl', [
  '$http', 'SomeCache', function($http, SomeCache) {
    var vm;
    vm = this;
    
    // gets data from api to populate table
    vm.getApiData = function() {
    	$http.get('https://athena-7.herokuapp.com/ancients.json').success(function(data) {
    		// assigns returned api data to variable on the scope
    		return vm.superheroArray = data
    	});
    }

    // calls the search endpoint upon search button click
    // uses $cacheFactory to avoid unnecessary api calls
    vm.search = function() {
    	$http.get('https://athena-7.herokuapp.com/ancients.json?search=Ath').success(function(data) {
    		searchData = data.ancients[0],
    		result = SomeCache.get(searchData),
    		status = 'pulled from cache';
    		if (!result) {
    			status = 'from API',
    			result = eval(searchData),
    			SomeCache.put(searchData, result);
    		}
    		vm.searchData = searchData;
    		vm.status = status;
    		vm.cacheInfo = SomeCache.info()
    		return vm.searchData, vm.status, vm.cacheInfo
    	});
    }

    // calls error endpoint
    vm.error = function() {
    	$http.get('https://athena-7.herokuapp.com/ancients.json?error=true').success(function(data) {
    		// API returns 422 so steps down to error callback
    		return
    	}).error(function(data) {
    		// assigns returned api data to variable on the scope
    		return vm.errorMsg = data.error
    	});
    }

    // clears cache upon button click
    vm.clearCache = function() {
        SomeCache.removeAll();
        vm.cacheInfo = SomeCache.info();
    }

    // initial API call
    vm.getApiData();
    
  }
])
.factory('SomeCache', function($cacheFactory) {
    return $cacheFactory('someCache', {
        capacity: 3 // optional - turns the cache into LRU cache
    });
})