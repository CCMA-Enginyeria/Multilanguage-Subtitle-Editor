require(['./model/me-user-features'],
    function(MeUserFeatures) {
        describe("Me User Features Model",
            function() {
                var features, responses;

                responses = {
                    success: {
                        status: 200,
                        responseText: JSON.stringify(mock_me_user_features)
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
                    //Global.initialize();
                    features = new MeUserFeatures();

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


                describe("meu usuari funcionalitas", function() {

                    beforeEach(function() {
                        features.fetch();
                    });

                    it("should do a GET request", function() {
                        var request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toBe('http://baseAPI/meu/usuari/funcionalitats');
                        expect(request.method).toBe('GET');

                    });

                    it("should fetch valid data", function(done) {
                        var request;

                        features.once('sync', function() {
                            var content = features.toJSON();
                            expect(content[0].id).toBe('SHOPPING_CART');
                            expect(content[0].descripcio).toBe("Permet enviar assets al carret o als llistats d'arxiu");
                            expect(content[0].disponibilitat).toBe(true);
                            expect(content[8].id).toBe('ARCHIVE_MARK');
                            expect(content[8].descripcio).toBe("Marcar per arxiu");
                            expect(content[8].disponibilitat).toBe(true);
                            done();
                        });

                        request = jasmine.Ajax.requests.mostRecent();
                        request.respondWith(responses.success);
                    });

                });

            });
    });