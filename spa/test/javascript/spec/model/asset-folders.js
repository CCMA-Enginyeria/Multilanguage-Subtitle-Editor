require(['./model/asset-folders'], function(AssetFolders) {
    describe("AssetFolders Collection ", function() {

        var col, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_asset_folders)
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

            col = new AssetFolders();
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
                expect(request.url).toBe('http://baseAPI/assets/24196948/carpetes');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request, asset;

                col.once('sync', function() {

                    expect(col.length).toBe(3);
                    expect(col.at(0).get('path')).toBe("DIGITION/INFORMATIUS/GRAFISME");
                    expect(col.at(1).get('tipus')).toBe("RUNDOWN");

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