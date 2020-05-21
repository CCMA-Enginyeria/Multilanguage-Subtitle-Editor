require(['./model/tipus-material', './model/asset', './model/asset-type'],
    function (MaterialCollection, AssetModel, AssetTypeModel) {
        describe("Material Collection ",
            function() {

                var col, responses;

                responses = {
                    success: {
                        status: 200,
                        responseText: JSON.stringify(mock_tipus_materials)
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

                    col = new MaterialCollection();


                    window.authTokenModel = {
                        getToken: function(cb) {
                            cb('token');
                        },
                        setToken: function(token) {}
                    };


                    jitConfig = {
                        staticsResourcesHost: '.',
                        baseAPI: 'http://baseAPI/'
                    };

                });

                afterEach(function () {
                    jasmine.Ajax.uninstall();
                });


                describe("materials without type", function () {

                    beforeEach(function () {
                        col.fetch();
                    });

                    it("should do a GET request", function () {

                        var request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toBe('http://baseAPI/tipusMaterials');
                        expect(request.method).toBe('GET');

                    });

                    it("should fetch valid data", function (done) {
                        var request;

                        col.once('sync', function () {

                            expect(col.length).toBe(32);
                            expect(col.at(2).get('id')).toBe('BLO');
                            expect(col.at(2).get('nom')).toBe('Blocs');

                            done();
                        });

                        request = jasmine.Ajax.requests.mostRecent();
                        request.respondWith(responses.success);
                    });

                    it("should fail with invalid data", function (done) {
                        var request;

                        col.once('error', function () {
                            expect(col.length).toBe(0);
                            expect(col.error.get('missatge')).toBe('missatge error');
                            done();
                        });

                        request = jasmine.Ajax.requests.mostRecent();
                        request.respondWith(responses.error);

                    });
                });
                
                describe("materials with type", function () {

                    beforeEach(function () {
                    	col.parentModel = new AssetModel({'tipus': new AssetTypeModel({'nom':'clip'})});
                    	col.parentModel.fetchTipusMaterials();
                    });

                    it("should do a GET request", function () {

                        var request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toBe('http://baseAPI/tipusMaterials?tipusAssetId=CLIP');
                        expect(request.method).toBe('GET');

                    });
                    
                });
                
            });
    });