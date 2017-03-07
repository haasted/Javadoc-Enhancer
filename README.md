# Javadoc-Enhancer
Javadoc-Enhander adds a powerful search-field to the class list of Javadoc page. The search field allows the use of wildcards and mimics the camel-case notation used for navigating classes in tools such as IntelliJ IDEA and Eclipse.

Go to the [demo page](http://bitcraft.dk/Javadoc-Enhancer/ "demopage") to see it in action and play around.

<img align="right" src="images/example1.gif">

# Installation

The search-field is inserted using a bookmarklet. Github doesn't allow javascript-links, so installation is done in one of the following ways:
* Go to the [demo page](http://bitcraft.dk/Javadoc-Enhancer/) and bookmark the link given in the ´*Installation*´ section.
* Copy the following url into an existing bookmark

    `javascript:(function(){function a(a,e){var n=document.createElement("script");n.src=a,n.onload=e,document.getElementsByTagName("head")[0].appendChild(n)}a("//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",function(){a("//cdn.rawgit.com/haasted/Javadoc-Enhancer/r1.1.0/dist/jdocenhance-min.js")})})()`

# Behind the scenes

The bookmarklet works by loading the script `jdocenhance.min.js` through the [rawgit.com](http://rawgit.com/) CDN. Only the bookmarklet needs to be installed.

# Future work

The following items are on the roadmap for future versions

* Automatically re-insert the script if the "All classes" frame changes.
* Keyboard navigation
* Look into creating a Greasemonkey script that automates the insertion.
* Make the bookmarklet load the latest release, rather than being locked into a specific version.
* Map out the differences in Javadoc through the ages to support older versions.