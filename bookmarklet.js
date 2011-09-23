// Stolen outright from the jQuerify bookmarklet 

(function() {
    if (typeof jQuery != 'undefined') {
//        msg = 'This page already using jQuery v' + jQuery.fn.jquery;

    } else if (typeof $ == 'function') {
        otherlib = true;
    }

    // more or less stolen form jquery core and adapted by paul irish
    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0],
        done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState
            || this.readyState == 'loaded'
            || this.readyState == 'complete')) {
                done = true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }
	// Load the two dependencies in sequence
    getScript('http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js',
    function() {
//		getScript('file:///Users/henrik/Documents/programming/JavadocEnhance/javadocbookmarklet.js', function() {});
		getScript('http://aasted.org/jdocenhance.js', function() {});
    });
})();
