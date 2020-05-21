require(['./view-model/search-box', '../../../../test/javascript/common/model-templates'], function(SearchBoxViewModel, ModelTemplates) {
    describe("Search box View Model", function() {

    	var searchBoxViewModel;
    	var arguments;

    	describe("search-box defaults", function () {
    		beforeEach(function() {
    			ModelTemplates.inicializeMeModel();
    			CercaModel = Backbone.Model.extend({
    				getSelectedFolderNom: function(){ return "test"; },
    				getSelectedFolderId: function(){ return "1"; },
    			    reset: function(){ }
    			});

    			EmptyCollection = Backbone.Collection.extend({});
				var selectedFormats = new EmptyCollection();

        		TipusMaterialCollection = Backbone.Collection.extend({});
        		var tipusMaterialCollection = new TipusMaterialCollection();

        		tipusMaterialCollection.add(new Backbone.Model({id: "AGS", nom: "Notícia agència", tipus: "MATERIAL_TYPE" }));
        		tipusMaterialCollection.add(new Backbone.Model({id: "ARX", nom: "Arxiu", tipus: "MATERIAL_TYPE"}));
        		tipusMaterialCollection.add(new Backbone.Model({id: "BLO", nom: "Blocs", tipus: "MATERIAL_TYPE"}));

        		FormatsCollection = Backbone.Collection.extend({});
				
				var formats = new FormatsCollection();
    			formats.add(new Backbone.Model({id: "4", nom:"4:3", relacioAspecte: "4:3"}));
				formats.add(new Backbone.Model({id: "100", nom:"HD", relacioAspecte: "16:9"}));
				
				selectedFormats.add(new Backbone.Model({id: "4:3"}));
			
				FontsCollection = Backbone.Collection.extend({});
				var fonts = new FontsCollection();
    			fonts.add(new Backbone.Model({"id": "1","uid": "APTN","nom": "Associated Press Television News - INFORMATIUS"}));
				fonts.add(new Backbone.Model({"id": "2","uid": "SNTV","nom": "Associated Press Television News - ESPORTS"}));
				
        		CercaCollection = Backbone.Collection.extend({});
        		var cercar = new CercaCollection;

        		var cerca = new CercaModel();
    			cerca.set({camps: [{id: "FITXA", nom: "Fitxa"},
				                   {id: "ESTRATS", nom: "Estrats"},
				                   {id: "TOT", nom: "Tot"},
				                  ],
		                   materialType: null,
						   formats: formats,
						   fonts: fonts,
		    	           llistatGrups: new EmptyCollection(),
		    	           selectedCamp: "FITXA",
		    	           orders: new EmptyCollection(),
		                   selectedFormats:  selectedFormats,
						   selectedGroups:  new EmptyCollection(),
						   selectedFonts:   new EmptyCollection(),
		                   selectedMaterials:  new EmptyCollection(),
		                   selectedOrders:  new EmptyCollection(),
		                   tipusMaterial: tipusMaterialCollection,
		                   cercar: cercar
    			});

    			window.meModel.set({
    				cerca: cerca
         		});

    			arguments = {smallSize: false, model: undefined}; 
        		searchBoxViewModel = new SearchBoxViewModel(null, arguments);
            });

    		it("should correct search box inicialized data", function () {
    			var data = searchBoxViewModel.toJSON();
    			expect(data.camps.length).toBe(3); // Fitxa, Estrats, Tot

             	expect(data.selectedOrders.length).toBe(0);
             	expect(data.selectedFolderName).toBe('test');
             	expect(data.selectedCamp).toBe('FITXA');
            });

    		describe("search box model listeners", function() {
    			it("check select material", function (done) {
        			searchBoxViewModel.once('change', function() {
           		 		var data = searchBoxViewModel.toJSON();
           		 		expect(data.selectedMaterials.length).toBe(1);
           		 		done();
           		 	});

           		 searchBoxViewModel.selectMaterial('material', ["AGS"]);
                });
    		});

    		describe("search box model listeners", function() {
    			it("check unselect formats", function (done) {
        			searchBoxViewModel.once('change', function() {
           		 		var data = searchBoxViewModel.toJSON();
           		 		expect(data.selectedFormats.length).toBe(0);
           		 		done();
           		 	});

           		 searchBoxViewModel.selectFormat('');
                });
    		});
    	});
    });
});