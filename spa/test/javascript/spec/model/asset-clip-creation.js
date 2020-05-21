require(['./model/asset-clip-creation',
        './model/asset'
    ],
    function (AssetClipCreation, AssetModel) {
        describe("Asset Clip Creation Model", function () {

            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(asset_clip_creation_material_collection)
                },
                error: {
                	status: 400,
					responseText: JSON.stringify({
						debugInfo: "debugInfo error",
						missatge: "missatge error"
					})
                }
            };

            beforeEach(function () {
                jasmine.Ajax.install();


                model = new AssetClipCreation();
                model.parentModel = new AssetModel({
                    id: '23911655',
                    tipus : {"id": 1, "nom": "test"}
                });

                window.authTokenModel = {
                    getToken: function (cb) {
                        cb('token');
                    },
                    setToken: function(token) {
                    }
                };
                
                window.meModel = {
                    getGrupId: function(cb) {
                        return 1001;           
                    }
                };


                jitConfig = {
                    staticsResourcesHost: '.',
                    baseAPI: 'http://baseAPI/'
                };

                model.fetch();
            });

            afterEach(function () {
                jasmine.Ajax.uninstall();
            });

            it("should do a GET request", function () {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_dadesCreacio?tipusAssetId=TEST&grupId=1001');
                expect(request.method).toBe('GET');

            });
            
            it("should get valid data", function(done) {
                var request;

                model.once('sync', function() {
                	expect(model.getDefaultTipusMaterial().id).toBe('SERA EL DEFAULT');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });
            

            it("should fail with invalid data", function(done) {
                var request;

                model.once('error', function() {
                    expect(model.get('tipusMaterials').length).toBe(0);
                    expect(model.error.get('missatge')).toBe("missatge error");
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
 

        });
    });