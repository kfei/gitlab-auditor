app

.controller("LangCtrl",
        ["$scope", "$mdBottomSheet",
        function($scope, $mdBottomSheet) {

	$scope.items = [
		{ name: "English", lang: "en_us" },
		{ name: "正體中文", lang: "zh_tw" }
	];

	$scope.listItemClick = function($index) {
		var clickedItem = $scope.items[$index];
		$mdBottomSheet.hide(clickedItem);
	};

}])

;
