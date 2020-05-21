require(['handlebars'], function(Handlebars) {
    Handlebars.registerHelper('stringify', function(context) {
        return JSON.stringify(context);
    });
});