/*globals
	define, Backbone
 */

define([], function() {
    var AppRouter = Backbone.Router.extend({        
        routes: {       
            "editor": "editor",
            "editor?:params": "editor",
            "reviewer?:params": "reviewer",    
            "reviewer": "reviewer",   
            "test": "test",
            "test/:params": "test",
            "": "default",
        },
    });    
    return new AppRouter();

    
});

