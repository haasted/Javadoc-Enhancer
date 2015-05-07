javascript: (function() {
    getScript('//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js', function() {
        getScript('//localhost:8080/jdocenhance.js')
    });

    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = success;

        document.getElementsByTagName('head')[0].appendChild(script)
    }
})()