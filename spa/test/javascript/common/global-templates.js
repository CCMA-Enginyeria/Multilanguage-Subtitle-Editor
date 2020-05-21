define([],
    function() {
        return {
            inicializedCollectionsAndPlugins: function() {
            	/** Collections **/
            	var estratType = new Backbone.Model({
            		"id": "id",
                    "nom": "nom",
                    "descripcio": "descripcio",
                    "mida": "mida",
                    "teKeyframes": true
            	});        	
            	var EstratsTypeCollection = Backbone.Collection.extend({
            		getEstratsTypes : function(){
                    	return estratsType;
                    }
            	}); 
            	var estratsType = new EstratsTypeCollection([estratType]); 
            	
            	EspaiModel = Backbone.Model.extend({
           			defaults: {
           				disponible: '50'
           			},
    			    fetch: function() {
    			    }
    			});
           		
           		AuthTokenModel = Backbone.Model.extend({
           	        defaults: {
           	            'digition': null,
           	            'login': null,
           	            'clau': null,
           	            'accessToken': null,
           	            'debugInfo': null,
           	            'missatge': null,
           	            'status': 0
           	        }
           		});
           		
           		window.estratsTypeCollection = estratsType;
           		window.espaiModel = new EspaiModel();
           		window.authTokenModel = new AuthTokenModel();
            	
           		return window;
            }
        }
    }
);