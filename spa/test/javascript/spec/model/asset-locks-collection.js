require(['./model/asset-locks-collection', './model/asset'], 
	function(AssetLocksCollection, AssetModel) {
        describe("Asset Lock Collection Model", function () {

        	var col, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(asset_lock_unlock_mock)
                },
                error: {
                    status: 400,
                    responseText: JSON.stringify({
                        debugInfo: "debugInfo error",
                        missatge: "missatge error"
                    })
                }
            };

            beforeEach(function() {

                jasmine.Ajax.install();
           
                col = new AssetLocksCollection();
                col.parentModel = new AssetModel({
                    id: '25391456'
                });

                window.authTokenModel = {
                    getToken: function(cb) {
                        cb('token');
                    }
                };
                
                jitConfig = {
                    staticsResourcesHost: '.',
                    baseAPI: 'http://baseAPI/'
                };

            });

            afterEach(function() {
                jasmine.Ajax.uninstall();
            });


            describe("asset", function() {

                beforeEach(function() {
                    col.fetch();
                });


                it("should do a GET request", function() {

                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/assets/25391456');
                    expect(request.method).toBe('GET');

                });

                it("should fetch valid data", function(done) {
                    var request, asset;
                    
                    col.once('sync', function() {

                        expect(col.parentModel.get('id')).toBe("25391456");
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fail with invalid data", function(done) {
                    var request;

                    col.once('error', function() {
                        expect(col.error.get('missatge')).toBe('missatge error');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.error);

                });

            });
        });

    });