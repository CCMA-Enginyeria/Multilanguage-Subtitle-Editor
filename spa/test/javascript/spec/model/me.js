require(['./model/me'],
    function(MeModel) {
        describe("Me Model", function() {
            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_me)
                },
                error: {
                    status: 401,
                    responseText: JSON.stringify({
                        debugInfo: "Usuari desconegut o contrasenya errònia",
                        missatge: "Accés denegat per falta de credencials"
                    })
                }
            };


            beforeEach(function() {

                jasmine.Ajax.install();

                window.authTokenModel = {
                    getToken: function(id) {
                        return "asdfghjkloiuyter";
                    }
                };

                model = new MeModel();

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


            describe("meu", function() {

                beforeEach(function() {
                    model.isFetching = false;
                    model.fetch();
                });

                it("should do a GET request", function() {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/meu');
                    expect(request.method).toBe('GET');

                });

                it("should fetch valid data", function(done) {
                    var request;

                    model.once('change', function() {
                        expect(model.get('digitionIdName')).toBe('PRODUCCIO');
                        done();
                    });


                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fecth valid userModel data", function(done) {
                    var request;

                    model.once('change', function() {
                        var user = model.get('usuari');
                        expect(user.get('login')).toBe('digi_tes');
                        expect(user.get('id')).toBe(2699);
                        expect(user.get('nom')).toBe('Proves Digitalització');
                        expect(user.get('cognoms')).toBe('Proves Digitalització');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fecth valid groupModel data", function(done) {
                    var request;

                    model.once('change', function() {
                        var group = model.get('grup');
                        expect(group.get('id')).toBe(1001);
                        expect(group.get('nom')).toBe('Informatius');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fetch valid folderModel data", function(done) {
                    var request;

                    model.once('change', function() {
                        var folder = model.get('carpeta');
                        expect(folder.get('id')).toBe(1001);
                        expect(folder.get('nom')).toBe('INGESTES');
                        expect(folder.get('path')).toBe('DIGITION/INGESTES');
                        expect(folder.get('tipus')).toBe('FOLDER');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });


            });

        });
    });