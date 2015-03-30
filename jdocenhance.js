// TODO Easy navigation to selected class.
//  - Maintain presence on page if a new package is selected.
//  - Explore whether String.prototype.localeCompare is more appropriate for string comparison.

(function() {
	console.log("Loading enhanced Javadoc");
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
    	console.log("Performing search");
        var search = $("#classSearch", packageFrame).val();
        if (search === previousSearch) return;

        console.log("Selector", selector);
        var start = binarySearchTop(search, $(selector, packageFrame));
        console.log("Found start index ", start);
        var end = binarySearchBottom(search, $(selector, packageFrame));
        console.log("Found end index ", end);

        console.time("Hide");
        var startEl = $(selector, packageFrame).eq(start);
        startEl.prevAll().addClass("filtered");

        var endEl = $(selector, packageFrame).eq(end);
        endEl.nextAll().addClass("filtered");

        console.timeEnd("Hide");

  //       var regexp = getRegExp(search);
		// clearSelection();

    //     if (search.indexOf(previousSearch) == 0) {
    //         $(selector + ":not(.filtered)", packageFrame)
    //         .filter(function(index, el) {
    //             return $(el).text().match(regexp) == null;
    //         }).addClass("filtered");
    //     } else if (previousSearch != undefined && previousSearch.indexOf(search) == 0) {
    //         $(selector + ".filtered", packageFrame)
    //         .filter(function(index, el) {
    //             return $(el).text().match(regexp) != null;
    //         }).removeClass("filtered");
    //     } else {
    //         $(selector, packageFrame)
    //         .each(function(index, element) {
				// element = $(element);
				// element.toggleClass("filtered", element.text().match(regexp) == null );
    //         });
    //     }

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

	// Find the first element that contains the prefix given.
	function binarySearchTop(prefix, items) {
		var bsTop = function(prefix, lis, low, high) {
			if (high < low)
				return -1;

			var mid = Math.floor((low + high) / 2);
			var txt = $(lis[mid]).text().substr(0, prefix.length);

			if (txt  > prefix)
				return bsTop(prefix, lis, low, mid - 1);

			if (txt < prefix)
				return bsTop(prefix, lis, mid+1, high);

			// Verify that the entry before this doesn't match the pattern.
			// If it does, continue the search upwards, else return mid.
			var txtPrev = $(lis[mid - 1]).text();
			if (txtPrev.indexOf(prefix) === 0)
				return bsTop(prefix, lis, low, mid - 1);

			return mid;
		}
		console.log(items.size());
		return bsTop(prefix, items, 0, items.size());
	}

	function binarySearchBottom(prefix, items) {
		var bsBottom = function(prefix, lis, low, high) {
			if (high < low)
				return -1;

			var mid = Math.floor((low + high) / 2);
			var txt = $(lis[mid]).text().substr(0, prefix.length);

			// Explore whether String.prototype.localeCompare is more appropriate for string comparison.
			if (txt > prefix)
				return bsBottom(prefix, lis, low, mid - 1);

			if (txt < prefix)
				return bsBottom(prefix, lis, mid+1, high);

			// Verify that the entry after this doesn't match the pattern.
			// If it does, continue search the downwards, else return mid.
			var txtNext = $(lis[mid + 1]).text();
			if (txtNext.indexOf(prefix) === 0)
				return bsBottom(prefix, lis, mid+1, high);

			return mid;
		}
		return bsBottom(prefix, items, 0, items.size());
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

		// el.css("background-color", "lightgray");
		el.addClass("selected");

		$("a:visible", packageFrame).eq(index).removeClass("selected");

		$("#classSearch", packageFrame).data("selectedindex", index + dir);

	}
})();