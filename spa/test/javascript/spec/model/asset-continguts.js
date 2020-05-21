require(['./model/asset'], function(AssetModel) {
    describe("Asset Continguts", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_asset_continguts)
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

            window.authTokenModel = {
                getToken: function(cb) {
                    cb('token');
                },
                setToken: function(token) {
                }
            };

            window.hqStateCollection = {
                get: function(id){
                    return new Backbone.Model({'estatFinal': true});
                }
            };

            model = new AssetModel();
            model.set('id' , 12231557);

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
                model.fetch();
            });

            it("should do a GET request", function() {
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/12231557');
                expect(request.method).toBe('GET');
            });

            it("should fetch valid data", function(done) {
                var request, asset;

                model.once('sync', function() {
                    expect(model.get('titol')).toBe("ADONIS POSSIBLE NOBEL");
                    expect(model.getContinguts().at(0).get('preset').id).toBe('10');
                    expect(model.getContinguts().at(0).get('preset').nom).toBe('Projecte Edicio Natural');

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

        });

    });
});