// hbtemplate.js plugin for requirejs / text.js
// it loads and compiles Handlebars templates
define('hbs',['handlebars'],
function (Handlebars) {

    var loadResource = function (resourceName, parentRequire, callback, config) {
        parentRequire([("text!" + resourceName +".hbs")],
            function (templateContent) {
                var template = Handlebars.compile(templateContent);
                callback(template);
            }
        );
    };

    return {
        load: loadResource
    };

});