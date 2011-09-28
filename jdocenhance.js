// TODO Easy navigation to selected class.
//  - Maintain presence on page if a new package is selected.

(function() {
    var timerObj, 
		previousSearch, // The search term the last time doSearch() was invoked.
		selector, // The selector used to identify each class entry. Varies between javadoc versions.
     	packageFrame = top.frames["packageFrame"].document,
     	classFrame = top.frames["classFrame"].document;

	// Position the search field relative to an appropriate element
	var searchFieldAnchor = $("div.indexContainer", packageFrame);
	if ( searchFieldAnchor.length == 0 ) {
		searchFieldAnchor = $("body", packageFrame);
	} 
	searchFieldAnchor.prepend('<input type="text" id="classSearch" style="margin-bottom: 10px" /><br/>');

	$('html > head', packageFrame).append('<style>.filtered { display: none; }</style>');
	$('html > head', packageFrame).append('<style>.selected { background-color : lightgray; }</style>');

	$("#classSearch", packageFrame).keyup(function(event) {		
		if (event.keyCode == 13 ) { // Enter			
			goToSelected();
		} else if (event.keyCode == 40) { // Down
			moveMarker(1);
		} else if (event.keyCode == 38) { // Up
			moveMarker(-1);
		}
	});

	//  Decide how the Javadoc is structured. Some versions are lists, while others are one massive sequence of anchor tags followed by breaks.
	if ( $("li", packageFrame).length > 1000 ) {
		selector = "li";
	} else {
		// Assuming it's the "<a ... </a><br/> version.
		// Wrap all the anchors and the following break tags in spans for easier collapse/expand operations.
		$("a", packageFrame).each(function(index, element) {
			$(element).next().andSelf().wrapAll("<span />");
		});	
		selector = "span";
	}
	
    $("#classSearch", packageFrame).keyup(function(event) {
        clearTimeout(timerObj);
        timerObj = setTimeout(doSearch, 250);
    });

    function doSearch() {
        var search = $("#classSearch", packageFrame).val();
        if (search == previousSearch) return;

        var regexp = getRegExp(search);
		clearSelection();
//		var start = new Date().getTime();

        if (search.indexOf(previousSearch) == 0) {
            $(selector + ":not(.filtered)", packageFrame)
            .filter(function(index, el) {
                return $(el).text().match(regexp) == null;
            }).addClass("filtered");
        } else if (previousSearch != undefined && previousSearch.indexOf(search) == 0) {
            $(selector + ".filtered", packageFrame)
            .filter(function(index, el) {
                return $(el).text().match(regexp) != null;
            }).removeClass("filtered");
        } else {
            $(selector, packageFrame)
            .each(function(index, element) {
				element = $(element);
				element.toggleClass("filtered", element.text().match(regexp) == null );
            });
        }

//		console.log("Visible count : " + $(selector + ":not(.filtered)", packageFrame).length);

        previousSearch = search;

//		console.log( "Execution time : " + (new Date().getTime() - start) );        
    };

	function getRegExp(search) { // I do not want to know the cyclomatic complexity of this one ...
		var result = "", 
			camelCase = false;
			
		$.each(search, function(index, c) {
			if (!isNaN(c)) { // Handle numbers. They don't work well with the isUpperCase-check, so get them out of the way.
				result += c;
			} else if (c == '*') {
				result += ".*";
			}  else if (c == '?') {
				result += ".";
			}  else if (c == '.') {
				result += "\\.";
			} else if (c == c.toUpperCase()) { // Camelcase handling
				camelCase = true;
				if (index == 0) {
					result += "^" + c;
				} else {
					result += "[a-z0-9]*" + c;
				}					
			} else {
				result += c;
			}
		});
		
		if (camelCase)			
			return new RegExp(result);
		else
			return new RegExp(result, "i");
	}

	function clearSelection () {
		var index = $("#classSearch", packageFrame).data("selectedindex");		
		if (!index)
			return;

		$("a:visible", packageFrame).eq(index).css("background-color", "");		
		$("#classSearch", packageFrame).data("selectedindex", null);		
	}

	function goToSelected() {
		var index = $("#classSearch", packageFrame).data("selectedindex"),
			anchor;
		
		if (index)
			anchor =  $("a:visible", packageFrame).eq(index);	
		else
			anchor = $("a:visible:first", packageFrame);
		
		classFrame.location.replace( anchor.attr("href") );		
	}

	function moveMarker(dir) {
//		var start = new Date().getTime();
		var index = $("#classSearch", packageFrame).data("selectedindex");
		if (!index)
			index = 0;			
		
		if (index + dir < 0)
			return;

		var el = $("a:visible", packageFrame).eq(index + dir);
		if (el.length == 0)
			return;

		// el.css("background-color", "lightgray");
		el.addClass("selected");

		$("a:visible", packageFrame).eq(index).removeClass("selected");
				
		$("#classSearch", packageFrame).data("selectedindex", index + dir);	
//		console.log( "Execution time : " + (new Date().getTime() - start) );        
	}
})();