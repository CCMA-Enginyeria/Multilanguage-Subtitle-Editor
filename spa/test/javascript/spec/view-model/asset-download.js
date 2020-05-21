require(['./view-model/asset-download', '../../../../test/javascript/common/model-templates'], function(AssetDownloadViewModel, ModelTemplates) {
    describe("Asset Download View Model", function() {
    	
    	var assetDownload;
    	var options;
    	    	
    	beforeEach(function() {
    		ModelTemplates.inicializeMeModel();
    		window.videoFormatCollection = {
    			getDownloadFormats: function() {
                    return ("HD", "4k");
                }
            };
        });

        afterEach(function() {
           
        });
        
        describe("inicialize view-model with diferent actions", function() {
	        it("should newAsset true with action is clip", function () {
	        	options = {"action": "clip"};
	        	assetDownload = new AssetDownloadViewModel(null, options);
	        	
	    		var data = assetDownload.toJSON();
	    	
	         	expect(data.newAsset).toBe(true);
	        });
	        
	        
			it("should newAsset false with action is download", function () {
				options = {"action": "download"};
				assetDownload = new AssetDownloadViewModel(null, options);
				
				var data = assetDownload.toJSON();
				
			 	expect(data.newAsset).toBe(false);
			});
        });
        
        describe("asset download view model listeners", function() {
        	 it("should update lastFormatDownload when change in me preferencies", function (done) {
        		 options = {"action": "download"};
     			 assetDownload = new AssetDownloadViewModel(null, options);
        		 assetDownload.once('change', function() {
        			 var data = assetDownload.toJSON();
        			 expect(data.downloadFormat).toBe('nou format');
        			
        			 done();
        		 })
        		 
        		 window.meModel.savePreferencies ({'lastFormatDownload': 'nou format'});
             });
        	 
        	 // TODO 
//        	 it("AssetClipboardCollection.mediasAvailables", function (done) {
//        		 
//           });
        });
        
        describe("asset download actions", function() {
        	beforeEach(function() {
        		 
            });
        	
        	it("check browser path", function (done) {
        		options = {"action": "download"};
    			assetDownload = new AssetDownloadViewModel(null, options);
       		 	assetDownload.once('change', function() {
       		 		var data = assetDownload.toJSON();
       		 		expect(data.downloadPath).toBe('tests_browseFolder');
       		 		done();
       		 	});
       		 	
       		 	assetDownload.browseFolder();
            });
        	
        	it("check checkAvailableFormats", function () {
        		options = {"action": "download"};
    			assetDownload = new AssetDownloadViewModel(null, options);
       		 	assetDownload.checkAvailableFormats();
       		 	var data = assetDownload.toJSON();
		 		expect(data.formatAvailable).toBe(true);
		 		expect(data.videoFormats).toBe('4k');
            });
       });

    });
});