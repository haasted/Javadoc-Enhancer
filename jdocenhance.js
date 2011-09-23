(function() {
    var timerObj, 
		previousSearch, // The search term the last time doSearch() was invoked.
		selector, // The selector used to identify each class entry. Varies between javadoc versions.
     	packageFrame = top.frames["packageFrame"].document;

	// Position the search field relative to an appropriate element
	var searchFieldAnchor = $("div.indexContainer", packageFrame);
	if ( searchFieldAnchor.length == 0 ) {
		searchFieldAnchor = $("body", packageFrame);
	}
	searchFieldAnchor.prepend('<input type="text" id="classSearch" style="margin-bottom: 10px" /><br/>');
	
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
        timerObj = setTimeout(doSearch, 100);
    });

    function doSearch() {
        var search = $("#classSearch", packageFrame).val();
        if (search == previousSearch) return;

        var regexp = getRegExp(search);
//		var start = new Date().getTime();
		
        if (search.indexOf(previousSearch) == 0) {
            $(selector, packageFrame)
            .filter(":visible")
            .filter(function(index, el) {
                return $(el).text().match(regexp) == null;
            }).hide();
        } else if (previousSearch != undefined && previousSearch.indexOf(search) == 0) {
            $(selector, packageFrame)
            .filter(":not(:visible)")
            .filter(function(index, el) {
                return $(el).text().match(regexp) != null;
            }).show();
        } else {
            $(selector, packageFrame)
            .each(function(index, element) {
				element = $(element);
				element.toggle( element.text().match(regexp) != null );
            });
        }

//		console.log( "Execution time : " + (new Date().getTime() - start) );
        previousSearch = search;
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
})();