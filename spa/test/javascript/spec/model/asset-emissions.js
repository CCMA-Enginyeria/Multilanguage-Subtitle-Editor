require(['./model/asset-emissions'], function(AssetEmissions) {
    describe("AssetEmissions Collection ", function() {

        var col, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_asset_emissions)
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

            col = new AssetEmissions();
            col.parentModel = new Backbone.Model({
                id: 24196948
            });

            window.authTokenModel = {
                getToken: function(cb) {
                    cb('token');
                },
                setToken: function(token) {
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


        describe("medias", function() {

            beforeEach(function() {
                col.fetch();
            });


            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/24196948/emissions');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request, asset;

                col.once('sync', function() {

                    expect(col.length).toBe(2);
                    expect(col.at(0).get('programa')).toBe("324 NOTÍCIES");
                    expect(col.at(1).get('data')).toBe("2011-11-04T01:10:58+01:00");

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                col.once('error', function() {
                    expect(col.length).toBe(0);
                    expect(col.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });

        });

    });
});