require(['./view-model/card', '../../../../test/javascript/common/model-templates'], function(CardViewModel, ModelTemplates) {
    describe("Card View Model", function() {
    	
    	var card;
    	var AssetTreballModel;
    	var bloquejos;
    	var camps;
    	
    	beforeEach(function() {
    		
    		ModelTemplates.inicializeMeModel();

       		AssetTreballModel = Backbone.Model.extend({
       			defaults: {
       				permisos: '511',
       				tipusMaterialsCollection: null,
       				carpetes: null,
       				emissions: null
       			},
			    
			    fetchTipusMaterials: function() {},
			    
			    sync: function(){
			    	this.trigger('sync');
			    },
			    
			    isClip: function() {
			    	return true;
			    },
			    
			    isLockByMeUser: function() {
			    	return false;
			    },
			    
			    getCarpetes: function() {
			    	return this.get('carpetes');
			    },
			    
			    getEmissions: function() {
			    	return this.get('emissions');
			    },
			    
			    isDetailedDataLoaded: function() {
			    	return false;
			    },
			    lockBy: function() {
			    	
			    },
			    isEditable: function() {
			    	return false;
			    }

			});
       		var assetTreball = new AssetTreballModel();
       		
    		workingClip = new Backbone.Model({
       			'titol': 'clip_titol'
       		});
       		
       		BloquejosCollection = Backbone.Collection.extend({}); 
    		bloquejos = new BloquejosCollection(); 
    		
    		CampsCollection = Backbone.Collection.extend({
    			setUrlParams: function(params){},
    			
    			sync: function() {}
    		}); 
    		camps = new CampsCollection(); 
       		
       		assetTreball.set({
       			'id': 100,
       			'idNumeric': 100,
       			'workingClip': workingClip,
       			'permisos':'504',
       			'bloquejos': bloquejos,
       			'camps': camps
       		});

       		window.meModel.set({
      			 assetTreball: assetTreball
      		});
       		
       		card = new CardViewModel();
        });
        
    	it("should have default data", function () {
    		var data = card.toJSON();
    		
    		expect(data.mesInfoState).toBe(false);
    		expect(data.vel).toBe(false);
    		expect(data.mostraBotoEdicio).toBe(false);
         	expect(data.carregant).toBe(true); 
        });

        
        describe("card model listeners", function() {
        	it("should update when preferences change", function (done) {
        		 card.once('change', function() {
	      			var data = card.toJSON();
	      			expect(data.mesInfoState).toBe(true);
	      			done();
	      		 })
	      		 
	      		window.meModel.savePreferencies ({'mesInfoState': 'true'});
	         });
        	
        	it("should update folders and emissions when working asset change", function (done) {
       		 	card.once('change:carpetes', function() {
	      			var data = card.toJSON();
	      			expect(data.carpetes).toEqual(mock_asset_folders);
	      			done();
	      		 })
	      		 
	      		 card.once('change:emissions', function() {
	      			var data = card.toJSON();
	      			expect(data.emissions).toEqual(mock_asset_emissions);
	      			done();
	      		 })
	      		 
	      		 var folders_lst = _.map(mock_asset_folders, function(val) {
				    return val;
				});
       		 	
	      		CarpetesCollection = Backbone.Collection.extend({}); 
       		 	carpetes = new CarpetesCollection(folders_lst); 
       		 	
       		 	var emissions_lst = _.map(mock_asset_emissions, function(val) {
				    return val;
				});
	      		EmissionsCollection = Backbone.Collection.extend({}); 
    		 	emissions = new EmissionsCollection(emissions_lst); 
	      		 
	      		var assetTreball = new AssetTreballModel({
	      			'id': 100,
	       			'idNumeric': 100,
	       			'workingClip': workingClip,
	       			'permisos':'504',
	       			'bloquejos': bloquejos,
	       			'camps': camps,
     				 'carpetes': carpetes,
      				 'emissions': emissions
					}); 
	      		
	      		window.meModel.set({
	      			'assetTreball': assetTreball
	      		});
	         });
       	 
        });

    });
});