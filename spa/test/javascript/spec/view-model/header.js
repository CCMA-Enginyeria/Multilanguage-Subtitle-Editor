require(['./view-model/header', '../../../../test/javascript/common/model-templates', '../../../../test/javascript/common/global-templates'], 
function(HeaderViewModel, ModelTemplates, GlobalTemplates) {
    describe("Header View Model", function() {

       var headerViewModel;

       beforeEach(function() {
             ModelTemplates.inicializeMeModel();
             GlobalTemplates.inicializedCollectionsAndPlugins();

             headerViewModel = new HeaderViewModel();
       });

        afterEach(function() {

        });
        
        var ME_MODEL_CHANGE_STATE = {
        		login: 'digi_tes', 
        		urlArxiu: null, 
        		carpeta: 'test', 
        		status: null, 
        		capacitat_color: null, 
        		disponible: null, 
        		hores50: null, 
        		minuts50: null, 
        		hores100: null, 
        		minuts100: null, 
        		gb: null
		},
		
		AUTH_MODEL_CHANGE_STATE = {
        	login: null,
            carpeta: null,
            disponible: null, 
    		hores50: null, 
    		minuts50: null, 
    		hores100: null, 
    		minuts100: null, 
    		gb: null,
            capacitat_color: null,
            urlArxiu: null,
            status: 0,
            grup: 'groupId'
        },
        
        ESPAI_MODEL_CHANGE_STATE = {
            	login: null,
                carpeta: null,
                disponible: 71, 
                hores50: 17, 
                minuts50: 43, 
                hores100: 42, 
                minuts100: 56, 
                gb: 250,
                capacitat_color: 'groc',
                urlArxiu: null,
                status: null
        };

        it("should have default data", function () {  
             var data = headerViewModel.toJSON();
             expect(data.login).toBe(null);        
             expect(data.urlArxiu).toBe(null); 
             expect(data.carpeta).toBe(null); 
             expect(data.status).toBe(null); 
             expect(data.capacitat_color).toBe(null);
             expect(data.disponible).toBe(null);
             expect(data.hores50).toBe(null);
             expect(data.minuts50).toBe(null);
             expect(data.hores100).toBe(null);
             expect(data.minuts100).toBe(null);
             expect(data.gb).toBe(null);
        });

        describe("Header listeners", function() {
             beforeEach(function() {
                    ModelTemplates.inicializeMeModel();
                    GlobalTemplates.inicializedCollectionsAndPlugins();

                    headerViewModel = new HeaderViewModel();
             });

             it("should update login and carpeta when model usuari.change:login", function (done) {
                    headerViewModel.once('change', function() {
                    	var data = headerViewModel.toJSON();
        	         	expect(data).toEqual(ME_MODEL_CHANGE_STATE);
                        done();
    	      		 })
    	      		 
    	      		window.meModel.trigger('usuari.change:login');
             });

             it("should update login and carpeta when model carpeta.change:path", function (done) {
                 headerViewModel.once('change', function() {
                 	var data = headerViewModel.toJSON();
     	         	expect(data).toEqual(ME_MODEL_CHANGE_STATE);
                     done();
 	      		 })
 	      		 
 	      		window.meModel.trigger('carpeta.change:path');
             }); 
             
             it("should update login and carpeta when auth model change accessToken", function (done) {
                 headerViewModel.once('change', function() {
                 	var data = headerViewModel.toJSON();
     	         	expect(data).toEqual(ME_MODEL_CHANGE_STATE);
     	         	expect(window.meModel.get('espai').fetch.called).toBeTruthy();
                     done();
 	      		 })
 	      		 
 	      		window.authTokenModel.trigger('change:accessToken');
             }); 

             it("should update status and grup when authModel change status", function (done) {
                 headerViewModel.once('change', function() {
                 	var data = headerViewModel.toJSON();
     	         	expect(data).toEqual(AUTH_MODEL_CHANGE_STATE);
                     done();
 	      		 })
 	      		 
 	      		 window.authTokenModel.trigger('change:status');
             }); 
             
             it("should update spaceInfo and capacitat_color when espai model change", function (done) {
                 headerViewModel.once('change', function() {
                 	var data = headerViewModel.toJSON();
     	         	expect(data).toEqual(ESPAI_MODEL_CHANGE_STATE);
                     done();
 	      		 })
 	      		 
 	      		 window.meModel.get('espai').trigger('sync');
             }); 
    
       });
    });
});