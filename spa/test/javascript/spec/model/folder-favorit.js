require(['./model/folder-favorit'],
    function(FolderFavorit) {
        describe("Folder Favorit Model", function() {
            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_folder_favorit)
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

                model = new FolderFavorit();

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

            
            describe("favorits", function() {

                
                it("should do a POST request", function() {
                    model.set({
                        "id" : "14768015"
                    });
                    model.save();
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/meu/favorits/carpetes');
                    expect(JSON.parse(request.params).carpeta.id).toBe('14768015');
                    expect(request.method).toBe('POST');

                });

                
                it("should fetch valid data", function(done) {
                    model.fetch();
                    var request;
                    model.once('change', function() {
                        expect(model.get('id')).toBe('14768015');
                        expect(model.get('idFav')).toBe(401);
                        expect(model.get('nom')).toBe("CASTINGS");
                        expect(model.get('tipus')).toBe("FOLDER");
                        expect(model.get('grup').id).toBe("1200");

                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

            });

        });
    });