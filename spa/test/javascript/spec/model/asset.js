require(['./model/asset'], function(AssetModel) {
    describe("Asset Model", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_asset)
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
            model.set('id' , 25389476);
            model.set('idNumeric' , 25389476);


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
                expect(request.url).toBe('http://baseAPI/assets/25389476');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request, asset;

                model.once('sync', function() {

                    expect(model.get('titol')).toBe("FUTBOL Resum 12' - Alabes - R.Societat");
                    expect(model.get('medias').at(0).get('preset').frameRate).toBe(25);
                    expect(model.get('carpetes').at(0).get('path')).toBe('DIGITION/_PROVES_ENGINYERIA');
                    expect(model.get('emissions').at(0).get('data')).toBe('2011-11-03T22:39:09+01:00');

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