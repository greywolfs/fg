HTMLElement.prototype.removeClass = function(remove) {
	var newClassName = "";
	var i;
	var classes = this.className.split(" ");
	for(i = 0; i < classes.length; i++) {
		if(classes[i] !== remove) {
			newClassName += classes[i] + " ";
		}
	}
	this.className = newClassName;
}
NodeList.prototype.removeClass = function(remove){
	var nodeList = document.getElementsByTagName("div");
	for (var i = 0; i < nodeList.length; ++i) {
		nodeList[i].removeClass(remove);
	}
}

var app = angular.module('finance_game',['lvl.directives.dragdrop']).controller('finance_game', function($scope, $http){
	$scope.parser = 0;
	$scope.load = false;
	$scope.css_data = {top: 10, left: 10};
	$scope.income = [
		{'key': 'Заработная плата', 'value': 50000}
	];
	$scope.expenditure = [
		{'key': 'Продукты', 'value': 15000},
		{'key': 'Аренда квартиры', 'value': 26000},
		{'key': 'Комунальные услуги', 'value': 2000}
	];
	$scope.cash_flow = 0;
	function count_cash_flow(){
		var full_income = 0,
			full_expenditure = 0;
		angular.forEach($scope.income, function(income){
			full_income += income.value;
		});
		angular.forEach($scope.expenditure, function(expenditure){
			full_expenditure += expenditure.value;
		});
		$scope.cash_flow = full_income - full_expenditure;
	}

	count_cash_flow();

	$scope.change_parent = function(dragEl,dropEl){
		if (dropEl === dragEl.parentElement){
			return;
		}
		var drag_index = dragEl.getAttribute('index'),
			drop_array = dropEl.className.match(/income/)?'income':'expenditure';
		var element;
		if (drop_array == 'income'){
			element = $scope.expenditure[drag_index];
			$scope.income.push(element);
			$scope.expenditure.splice(drag_index,1);
		}else{
			element = $scope.income[drag_index];
			$scope.expenditure.push(element);
			$scope.income.splice(drag_index,1);
		}
		count_cash_flow();
		$scope.$digest();
		document.getElementsByClassName("lvl-target").removeClass("lvl-target");
		document.getElementsByClassName("lvl-over").removeClass("lvl-over");
	};

	$scope.dropped = function(dragEl, dropEl) {
		// function referenced by the drop target
		//this is application logic, for the demo we just want to color the grid squares
		//the directive provides a native dom object, wrap with jqlite
		var drop = angular.element(dropEl);
		var drag = angular.element(dragEl);

		//clear the previously applied color, if it exists
		var bgClass = drop.attr('data-color');
		if (bgClass) {
			drop.removeClass(bgClass);
		}

		//add the dragged color
		bgClass = drag.attr("data-color");
		drop.addClass(bgClass);
		drop.attr('data-color', bgClass);

		//if element has been dragged from the grid, clear dragged color
		if (drag.attr("x-lvl-drop-target")) {
			drag.removeClass(bgClass);
		}
	}
});
