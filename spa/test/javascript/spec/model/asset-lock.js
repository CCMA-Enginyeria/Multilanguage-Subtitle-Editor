require(['./model/asset-locks-collection', './model/asset', './model/asset-lock'], 
	function(AssetLocksCollection, AssetModel, AssetLockModel) {
        describe("Asset Lock Model", function () {

        	var col, responses, model;

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
                model = new AssetLockModel();
                col = new AssetLocksCollection();
                col.parentModel = new AssetModel({
                    id: '25391456'
                });
                
                model.collection = col;

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


            describe("asset _bloqueja", function() {

                beforeEach(function() {
                	model.save();
                });


                it("should do a POST _bloqueja request", function () {

                    var request = jasmine.Ajax.requests.mostRecent(),
                        data = request.data();
                    expect(request.url).toBe('http://baseAPI/assets/_bloqueja');
                    expect(request.method).toBe('POST');
                    expect(data.id).toBe('25391456');
                });

                it("should get valid data", function (done) {
                    var request;

                    model.once('sync', function () {
                        expect(model.error).toBe(undefined);
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });


                it("should fail with invalid data", function (done) {
                    var request;

                    model.once('error', function () {
                        expect(model.error.get('missatge')).toBe('missatge error');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.error);

                });
            });
            
        });

    });