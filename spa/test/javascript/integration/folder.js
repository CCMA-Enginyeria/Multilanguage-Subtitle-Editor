require(['./model/folder', './model/auth-token'],
    function (FolderModel, AuthTokenModel) {
        describe("Folder Model Integration", function () {
            var folderModel;
            var setTokenSpy;
            
            beforeEach(function () {
            	window.authTokenModel = new AuthTokenModel();
            	setTokenSpy = spyOn(window.authTokenModel, "setToken");
                folderModel = new FolderModel();
            });

            describe("Folder", function() {
                beforeEach(function() {
                    folderModel.fetch();
                });
                
                it("should refresh token", function (done) {
                	folderModel.once('change', function () {
                		expect(setTokenSpy).toHaveBeenCalled();
                		done();
                    });
                });
             
            });

        });

    });