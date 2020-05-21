require(['sinon', './view-model/clip-creator', '../../../../test/javascript/common/model-templates'], function(sinon, ClipCreatorViewModel, ModelTemplates) {
    describe("Clip creator View Model", function() {
    	
    	var clipCreator;
    	var AssetTreballModel;
    	var TipusMaterialCollection;
    	var workingClip;
    	var tipus_clip_treball, tipus_trailer;
    	var tipusMaterials;
    	    	
    	beforeEach(function() {
    		ModelTemplates.inicializeMeModel();

    		workingClip = new Backbone.Model({
       			'titol': 'clip_titol'
       		});
    		
    		tipus_clip_treball = {
    			 "id": "TRB",
    		     "nom": "Clip de treball",
    		     "seleccionat": true,
    		     "dataCaducitat": "2018-08-31T11:59:11+02:00",
    		     "perArxiu": true
    		};
    		
    		tipus_trailer = {
    			"id": "TRC",
    		    "nom": "Trailer",
    		    "seleccionat": false,
    		    "dataCaducitat": "2018-09-05T11:59:11+02:00",
    		    "perArxiu": false
    		};
    		 
    		tipusMaterials = []; 
    		tipusMaterials.push(tipus_clip_treball);
    		tipusMaterials.push(tipus_trailer);

       		
       		AssetTreballModel = Backbone.Model.extend({
       			
       			defaults: {
       				permisos: '511',
       				tipusMaterialsCollection: null,
       				dadesCreacioClip : null
       			},
			    
       			fetchDadesCreacioClip: function() {
       				dadesCreacioClip.trigger('sync');
			    },
			    
			    getTipusMaterialsForClipForm: function() {
			    	return tipusMaterials;
			    },
			    
			    getDefaultTipusMaterialForClipForm: function() {
			    	return tipus_clip_treball;
			    }

			});
       		
       		var assetTreball = new AssetTreballModel();
       		var dadesCreacioClip = new Backbone.Model();
       		assetTreball.set({
       			'dadesCreacioClip': dadesCreacioClip,
       			'workingClip': workingClip,
       			'permisos':'504'
       		});

       		window.meModel.set({
      			 assetTreball: assetTreball
      		});
       		
       		clipCreator = new ClipCreatorViewModel();
        });  
    	
    	it("should have default data", function () {
    		var data = clipCreator.toJSON();    		 
    		
    		expect(data.tipusMaterials).toBe(tipusMaterials);
         	expect(data.tipusMaterial).toBe('TRB');     
         	expect(data.grup).toBe('groupId');
         	expect(data.perArxiu).toBe(true)
         	expect(data.dataCaducitat).toBe("2018-08-31");
         	expect(data.grups).toEqual([{
         		id: 'groupId',
                nom: 'groupName'
         	}]);
         	expect(data.permis).toBe('504');
        });
    });
});