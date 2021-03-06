// TODO Easy navigation to selected class.
//  - Maintain presence on page if a new package is selected.

console.log("jdocenhance.js loaded");

(function() {
    var timerObj,
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
	// TODO Improve this detection. Include links to examples of the different structures in comments.
	if ( $("li", packageFrame).length > 10 ) {
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
        console.log("Postponing search due to user input.");
        timerObj = setTimeout(doSearch, 250);
    });

    function doSearch() {
    	clearTimeout(timerObj);

        var search = $("#classSearch", packageFrame).val();

        // Clear the entire search. TODO This could perhaps be done smarter by checking whether this search is a subset of the previous.
        $(selector, packageFrame).removeClass("filtered");

        // The first fragment of the search string decides the search strategy.
        var firstFragment = search.match(/([A-Z]{1}[a-z]*|\*|[a-z]+)/);

        if (firstFragment === null || search.trim() === '*') {
        	console.log("Clearing search.");
        	$(selector, packageFrame).removeClass("filtered");
        	return;
        }

        firstFragment = firstFragment[0];

        // Various search strategies, depending on the search term used
        if (firstFragment === '*') {
			console.log("Wildcard found. Using brute for search.");
        	// Initial wild-card. Do a complete brute-force search.
        	var regexp = getRegExp(search);
        	bruteSearch($(selector, packageFrame), regexp);
        	return;
        }

        if (firstFragment === search) {
        	// No camel-case. Do a simple prefix-search.
        	binarySearch(firstFragment);
        	return;
        }

        // CamelCase search. Start binary, filter the remaining brute-force.
        console.log("Performing camel case binary search.");
        binarySearch(firstFragment);

        var regexp = getRegExp(search);
        console.log("Regexp for remaining search ", regexp);
        bruteSearch($(selector + ":not(.filtered)", packageFrame), regexp);
    };

    function binarySearch(prefix) {
    	console.log("Binary search with regexp", prefix);
        var start = binarySearchTop(prefix, $(selector, packageFrame));
        var end = binarySearchBottom(prefix, $(selector, packageFrame));

    	console.log("Binary search start index ", start);
    	console.log("Binary search end index ", end);
        if (start == -1 || end == -1) {
    		$(selector, packageFrame).addClass("filtered");
        	return;
        }

        // TODO Measure potential improvement of including index inside selector string.

        // TODO 2 Investigate surrounding the groups with a hidden span, rather than hiding each list element.
        // - Update : far slower, but works in Chrome.
        var startEl = $(selector, packageFrame).eq(start);
        startEl.prevAll().addClass("filtered");

        var endEl = $(selector, packageFrame).eq(end);
        endEl.nextAll().addClass("filtered");
    }

    function bruteSearch(elements, regexp) {
    	elements.each(function(idx, el) {
    		el = $(el);
    		el.toggleClass("filtered", el.text().match(regexp) === null);
    	});
    }

	function getRegExp(search) { // I do not want to know the cyclomatic complexity of this one ...
		var result = "",
			camelCase = false;

		$.each(search.split(''), function(index, c) {
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

	// Find the first element that contains the prefix given.
	function binarySearchTop(prefix, items) {
		var bsTop = function(prefix, lis, low, high) {
			if (high < low)
				return -1;

			var mid = Math.floor((low + high) / 2);
			var txt = $(lis[mid]).text().substr(0, prefix.length).toLowerCase();;

			if (txt  > prefix)
				return bsTop(prefix, lis, low, mid - 1);

			if (txt < prefix)
				return bsTop(prefix, lis, mid+1, high);

			// Verify that the entry before this doesn't match the pattern.
			// If it does, continue the search upwards, else return mid.
			var txtPrev = $(lis[mid - 1]).text().toLowerCase();
			if (txtPrev.indexOf(prefix) === 0)
				return bsTop(prefix, lis, low, mid - 1);

			return mid;
		}

		return bsTop(prefix.toLowerCase(), items, 0, items.size());
	}

	function binarySearchBottom(prefix, items) {
		var bsBottom = function(prefix, lis, low, high) {
			if (high < low)
				return -1;

			var mid = Math.floor((low + high) / 2);
			var txt = $(lis[mid]).text().substr(0, prefix.length).toLowerCase();

			// Explore whether String.prototype.localeCompare is more appropriate for string comparison.
			if (txt > prefix)
				return bsBottom(prefix, lis, low, mid - 1);

			if (txt < prefix)
				return bsBottom(prefix, lis, mid+1, high);

			// Verify that the entry after this doesn't match the pattern.
			// If it does, continue search the downwards, else return mid.
			var txtNext = $(lis[mid + 1]).text().toLowerCase();
			if (txtNext.indexOf(prefix) === 0)
				return bsBottom(prefix, lis, mid+1, high);

			return mid;
		}

		return bsBottom(prefix.toLowerCase(), items, 0, items.size());
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
		var index = $("#classSearch", packageFrame).data("selectedindex");
		if (!index)
			index = 0;

		if (index + dir < 0)
			return;

		var el = $("a:visible", packageFrame).eq(index + dir);
		if (el.length == 0)
			return;

		el.addClass("selected");

		$("a:visible", packageFrame).eq(index).removeClass("selected");

		$("#classSearch", packageFrame).data("selectedindex", index + dir);

	}
})();