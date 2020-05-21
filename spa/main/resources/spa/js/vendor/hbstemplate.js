// plugin per requirejs per carregar hbs dins de jitpub
define('hbstemplate', ['handlebars'],
    function (Handlebars) {

        var loadResource = function (resourceName, parentRequire, callback, config) {
            if (window.location.protocol === 'https:') {
                resourceName = resourceName.replace('http:', window.location.protocol);
            }
            resourceName += ".hbs";
            if(config.urlArgs){
                resourceName += '?'+config.urlArgs;  
            }
            $.get(resourceName).success(function (templateContent) {
                var template = Handlebars.compile(templateContent);
                callback(template);
            });
        };

        return {
            load: loadResource
        };

    });