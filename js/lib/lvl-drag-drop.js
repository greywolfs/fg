var module = angular.module("lvl.directives.dragdrop", ['lvl.services']);

module.directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
	    return {
	        restrict: 'A',
	        link: function(scope, el, attrs, controller) {
	        	angular.element(el).attr("draggable", "true");
	            
	            var id = angular.element(el).attr("id");
	            if (!id) {
	                id = uuid.new()
	                angular.element(el).attr("id", id);
	            }
	            
	            el.bind("dragstart", function(e) {
	                e.dataTransfer.setData('text', id);

	                $rootScope.$emit("LVL-DRAG-START");

					angular.element(e.target).addClass('lvl-drag');
				});
	            
	            el.bind("dragend", function(e) {
	                $rootScope.$emit("LVL-DRAG-END");

					angular.element(e.target).removeClass('lvl-drag');
	            });
	        }
    	}
	}]);

module.directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
	var dropObject;
	    return {
	        restrict: 'A',
	        scope: {
	            onDrop: '&'
	        },
	        link: function(scope, el, attrs, controller) {
	            var id = angular.element(el).attr("id");
	            if (!id) {
	                id = uuid.new();
	                angular.element(el).attr("id", id);
	            }

	            el.bind("dragover", function(e) {
	              if (e.preventDefault) {
	                e.preventDefault(); // Necessary. Allows us to drop.
	              }

	              e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	              return false;
	            });
	            
	            el.bind("dragenter", function(e) {
	              // this / e.target is the current hover target.
					var testObj = e.target;
					do {
						if (testObj.getAttribute('x-lvl-drop-target') == 'true'){
							angular.element(testObj).addClass('lvl-over');
							dropObject = testObj;
							break;
						}
					}while(testObj = testObj.parentNode);
	            });

	            el.bind("dragleave", function(e) {
					var testObj = e.target;
					do {
						if (testObj.getAttribute('x-lvl-drop-target') == 'true'){
							break;
						}
					}while(testObj = testObj.parentNode);
					if (dropObject != testObj ){
						angular.element(testObj).removeClass('lvl-over');  // this / e.target is previous target element.
					}
					dropObject = {};
	            });

	            el.bind("drop", function(e) {
	              if (e.preventDefault) {
	                e.preventDefault(); // Necessary. Allows us to drop.
	              }

	              if (e.stopPropogation) {
	                e.stopPropogation(); // Necessary. Allows us to drop.
	              }
	            	var data = e.dataTransfer.getData("text");
	                var dest = document.getElementById(id);
	                var src = document.getElementById(data);
	                
	                scope.onDrop({dragEl: src, dropEl: dest});
	            });

	            $rootScope.$on("LVL-DRAG-START", function() {
	                var el = document.getElementById(id);
	                angular.element(el).addClass("lvl-target");
	            });
	            
	            $rootScope.$on("LVL-DRAG-END", function() {
	                var el = document.getElementById(id);
	                angular.element(el).removeClass("lvl-target");
	                angular.element(el).removeClass("lvl-over");
	            });
	        }
    	}
	}]);