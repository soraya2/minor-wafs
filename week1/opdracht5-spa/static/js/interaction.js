(function(){

  'use strict';
    var xhr, getData, app, config;

    config = {
        url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp'
    };

    app = {
        init: function() {
            getData.request();

        }

    };

    getData = {
        request: function() {
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(callback) {
                console.log(callback);
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr.responseText);

                }
                xhr.open('GET', config.url, true);

                xhr.send();
            };

        }

    };


    app.init();

}());
