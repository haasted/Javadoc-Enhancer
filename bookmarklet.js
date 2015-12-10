javascript: (function() {
    getScript('//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js', function() {
        getScript('//cdn.rawgit.com/haasted/Javadoc-Enhancer/42dae9f93195561629ece3ab5ff5857802d48ae0/jdocenhance.min.js')
    });

    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = success;

        document.getElementsByTagName('head')[0].appendChild(script)
    }
})()