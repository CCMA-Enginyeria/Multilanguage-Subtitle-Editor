require(['handlebars'], function(Handlebars) {
    Handlebars.registerHelper('if_not_eq', function(a, b, opts) {
        if (a !== b) // Or !== depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    });
});