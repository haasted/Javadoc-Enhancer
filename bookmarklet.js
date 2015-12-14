javascript: (function() {
    getScript('//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js', function() {
        getScript('//cdn.rawgit.com/haasted/Javadoc-Enhancer/e9a0e7f8f165b2f26c4dddb6efa3d1849c666ba8/jdocenhance.min.js')
    });

    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = success;

        document.getElementsByTagName('head')[0].appendChild(script)
    }
})()