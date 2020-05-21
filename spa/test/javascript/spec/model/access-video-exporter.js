require(['./model/access-video-exporter', './model/folder'],
    function(AccessVideoExporterModel, FolderModel) {
        describe("Access Video Exporter Model",
            function() {

                var model, responses;

                responses = {
                    success: {
                        status: 200,
                        responseText: JSON.stringify(mock_access_video_exporter)
                    },
                    error: {
                        status: 400,
                        responseText: JSON.stringify({
                            debugInfo: "/digition-api/autenticacio/accesVideoExporter",
                            missatge: "Asset amb ID 25277584 no trobat"
                        })
                    }
                };

                beforeEach(function() {
                    jasmine.Ajax.install();

                    window.hqStateCollection = new Backbone.Collection;
                    window.hqStateCollection.load = function(cb) {
                        cb()
                    };

                    model = new AccessVideoExporterModel();
                    model.parentModel = new FolderModel({
                        id: '25277584'
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

                    model.setPerfil('perfil');
                    model.fetch();
                });

                afterEach(function() {
                    jasmine.Ajax.uninstall();
                });

                it("should do a GET request", function() {

                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/autenticacio/accesVideoExporter?assetId=25277584&perfil=perfil');
                    expect(request.method).toBe('GET');

                });

                it("should do another GET request if profile empty", function() {
                	 model = new AccessVideoExporterModel();
                     model.parentModel = new FolderModel({
                         id: '25277584'
                     });
                	model.setPerfil('');
                	model.fetch();
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/autenticacio/accesVideoExporter?assetId=25277584');
                    expect(request.method).toBe('GET');

                });
                
                it("should fetch valid data", function(done) {
                    var request;

                    model.once('sync', function() {

                        expect(model.get('url')).toBe('http://url_a_digition2');

                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fail with invalid id", function(done) {
                    var request;

                    model.once('error', function() {
                        expect(model.error.get('debugInfo')).not.toBeNull();
                        expect(model.error.get('missatge')).not.toBeNull();
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.error);
                });


            });
    });