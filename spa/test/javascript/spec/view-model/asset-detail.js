require(['./view-model/asset-detail', '../../../../test/javascript/common/model-templates'], function(AssetViewModel, ModelTemplates) {
    describe("Asset Detail View Model", function() {

        
    	var assetDetail, anotherAssetDetail;
    	var regionModel;
    	var assetType;
    	beforeEach(function() {

    		ModelTemplates.inicializeMeModel();
    		
        	regionModel = new Backbone.Model({
				estaVisible: false
			});
        	AssetViewModel = AssetViewModel.extend({
        		_getAssetDetailRegion: function() {
        			return regionModel;
        		}
        	})
        	assetDetail = new AssetViewModel();
        	anotherAssetDetail = new AssetViewModel()
        });

        afterEach(function() {
           
        });
        
        it("should have default data", function () {
    		var data = assetDetail.toJSON();
         	expect(data.titol).toBe('');         
         	expect(data.pestanyaSeleccionada).toBe('keyframes');
        });

        describe("asset detail model listeners", function() {
        	 it("should update when working asset change", function (done) {
        		 assetDetail.once('change', function() {
        			 var data = assetDetail.toJSON();
        			 expect(data.id).toBe('nou id');
        			 expect(data.idNumeric).toBe('nou assetId');
        			 expect(data.titol).toBe('nou titol');
        			 expect(data.pestanyes).toEqual([{
                         'nom': 'keyframes',
                         'props': 'viewModel.getKeyframes'
                     }, {
                         'nom': 'estrats',
                         'props': 'viewModel.getEstrats',
                         'clipboard': 'viewModel.getEstratsClipboard',
                         'medias': 'viewModel.getMedias'
                     }]);
        			 done();
        		 })
        		 
        		 assetType = new Backbone.Model({
	    			id: "11",
	    		    nom: "Vídeo"
	    		 });
        		 window.meModel.set({
        			 assetTreball: new Backbone.Model({
        				 id: 'nou id',
        				 idNumeric: 'nou assetId',
        				 titol: 'nou titol',
        				 tipus: assetType
        			 })
        		 });
             });
        	 
        	 it("should hide tabs when no video working asset change", function (done) {
        		 assetDetail.once('change', function() {
        			 var data = assetDetail.toJSON();
        			 expect(data.id).toBe('nou id');
        			 expect(data.idNumeric).toBe('nou assetId');
        			 expect(data.titol).toBe('nou titol');
        			 expect(data.pestanyes).toBe(null);
        			 done();
        		 })
        		 
        		 assetType = new Backbone.Model({
	    			id: "16",
	    		    nom: "Àudio"
	    		});
        		 window.meModel.set({
        			 assetTreball: new Backbone.Model({
        				 id: 'nou id',
        				 idNumeric: 'nou assetId',
        				 titol: 'nou titol',
        				 tipus: assetType
        			 })
        		 });
             });
        });

        describe("asset detail actions", function() {
        	 it("should update tab when selectTab call", function (done) {
        		 assetDetail.once('change', function() {
        			 var data = assetDetail.toJSON();
        			 expect(data.pestanyaSeleccionada).toBe('nova pestanya');
        			 done();
        		 })
        		 
        		 assetDetail.selectTab('nova pestanya');
             });
       
       	 it("keyframes should remember tab", function () {
       		 assetDetail.once('change', function() {
       			var data = assetDetail.toJSON();
       		 	expect(data.pestanyaSeleccionada).toBe('keyframes');
       		 	done();
       		 })
       		assetDetail.selectTab('keyframes');
       		  anotherAssetDetail.once('change', function() {
       			  var anotherData = anotherAssetDetail.toJSON();
       			  expect(anotherData.pestanyaSeleccionada).toBe('keyframes');
       			  done();
       		 })
       		 anotherAssetDetail.initialize();
            });
       	 
       	it("estrats should remember tab", function (done) {
      		 assetDetail.once('change', function() {
      			 var data = assetDetail.toJSON();
      			 expect(data.pestanyaSeleccionada).toBe('estrats');
      			 done();
      		 })
      		 assetDetail.selectTab('estrats');
      		  anotherAssetDetail.once('change', function() {
      			  var anotherData = anotherAssetDetail.toJSON();
      			  expect(anotherData.pestanyaSeleccionada).toBe('estrats');
      			  done();
      		 })
      		 anotherAssetDetail.initialize();
           });
       });
    });
});