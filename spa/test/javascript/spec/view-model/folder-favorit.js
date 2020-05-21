require(['./view-model/folder-favorit', '../../../../test/javascript/common/model-templates'], 
function(FolderFavoritViewModel, ModelTemplates) {
    describe("Folder Favorit View Model", function() {
       	
    	var folderFavViewModel;
    	var options=[];
    	var spy_model;
    	var spy_preferences;
    	var spy_reset;
    	
    	describe("folder fav defaults", function () {
    		beforeEach(function() {
        		ModelTemplates.inicializeMeModel();
        		ModelTemplates.inicializeFolderFavModel();
        		
        		options.model = folderFavModel;
        		
        		folderFavViewModel = new FolderFavoritViewModel(null, options);
            });
    		
    		it("should get inicialized data", function (done) {
				var data = folderFavViewModel.toJSON();
				expect(data).not.toBeNull();
				done(); 
            });
    	});
    	
    	
    });
});