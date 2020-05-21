require(['sinon', './model/asset-copy', './model/asset'], function(sinon, AssetCopyModel, AssetModel) {
    describe("Asset Copy Model", function() {

        var model, responses;

        responses = {
            success: {
                status: 201,
                responseText: JSON.stringify(asset_copy_mock)
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

            window.hqStateCollection = {
                get: function(id) {
                    return new Backbone.Model({
                        'estatFinal': true
                    });
                }
            };

            model = new AssetCopyModel();
            model.parentModel = new AssetModel({
                id: '25391456'
            });

            model.set({
                "online": true,
                "desti": {
                    "carpeta": 123,
                    "grup": 123
                }
            });

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

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });


        describe("copy asset to cart", function() {

            beforeEach(function() {
                model.save();
            });

            it("should do a POST request", function() {
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_envia');
                expect(request.method).toBe('POST');
            });

            it("should get valid data", function(done) {
                var request;

                model.once('sync', function() {
                    expect(model.get('id')).toBe('25391456');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                model.once('error', function() {
                    expect(model.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);
            });

            it("should call to setTaskRowToRunning when sendToCart is called", function() {
                model.parentModel = {
                    get: sinon.spy(),
                    setTaskRowToRunning: sinon.spy()
                };
                model.sendToCart();
                expect(model.parentModel.setTaskRowToRunning.calledOnce).toBeTruthy();
            });
        });

    });
});