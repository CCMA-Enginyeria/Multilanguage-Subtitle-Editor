require(['./model/asset-hqstate',
        './model/folder'
    ],
    function (AssetHqStateModel, FolderModel) {
        describe("Asset HqState Model", function () {

            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_asset_hqstate)
                },
                error: {
                    status: 400,
                    responseText: JSON.stringify({
                            debugInfo: "/digition-api-0.1648.0-SNAPSHOT/assets/23911655/hqEstat",
                            missatge: "CarpetaId not found 4770935"
                        }) // No entiendo como testear el ERROR
                }
            };

            beforeEach(function () {
                jasmine.Ajax.install();

                window.hqStateCollection = new Backbone.Collection;
                window.hqStateCollection.load = function (cb) {
                    cb()
                };

                model = new AssetHqStateModel();
                model.parentModel = new FolderModel({
                    id: '23911655'
                });

                window.authTokenModel = {
                    getToken: function (cb) {
                        cb('token');
                    },
                    setToken: function(token) {
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
                expect(request.url).toBe('http://baseAPI/assets/23911655/hqEstat');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function (done) {
                var request;

                model.once('sync', function () {

                    expect(model.get('id')).not.toBe(null);
                    expect(model.get('id')).toBe('2');

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function (done) {
                var request;

                model.once('error', function () {

                    expect(model.error.get('missatge')).toBe('CarpetaId not found 4770935');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });

        });
    });