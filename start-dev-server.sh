#!/bin/bash

echo "Javadoc-Enhancer is now available using the bookmarklet that has been copied to the clipboard."
echo '!function(){function a(a,e){var n=document.createElement("script");n.src=a,n.onload=e,document.getElementsByTagName("head")[0].appendChild(n)}a("//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",function(){a("//localhost:8000/jdocenhance.js")})}();' | pbcopy

cd src
python -m SimpleHTTPServer
cd -