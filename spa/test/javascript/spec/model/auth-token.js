require(['./model/auth-token'],
    function(AuthTokenModel) {
        describe("Auth-token Model", function() {
            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify({
                        accessToken: 'token'
                    })
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

                model = new AuthTokenModel();
                
                jitConfig = {
                    staticsResourcesHost: '.',
                    baseAPI: 'http://baseAPI/'
                };

            });

            afterEach(function() {
                jasmine.Ajax.uninstall();
            });


            describe("login", function() {
                beforeEach(function() {
                    model.login('user', 'pass', 'PRODUCCIO')
                });

                it("should do a POST request", function() {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/autenticacio/login');
                    expect(request.method).toBe('POST');
                    expect(request.data()).toEqual({
                        digition: 'PRODUCCIO',
                        login: 'user',
                        clau: 'pass'
                    });
                });

                it("should success with valid data", function(done) {
                    var request;

                    model.once('change:status', function() {
                        expect(model.get('accessToken')).toBe('token');
                        done();
                    });


                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fail with invalid data", function(done) {
                    var request;

                    model.once('change:status', function() {
                        expect(model.get('debugInfo')).toBeDefined();
                        expect(model.get('missatge')).toBeDefined();
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.error);
                });

            });

            describe("logout", function() {
                beforeEach(function() {
                    model.login('user', 'pass', 'PRODUCCIO')
                });
                it("should delete data", function() {
                    model.logout();
                    expect(model.get('accessToken')).toBeFalsy();
                    expect(model.get('status')).toBe(AuthTokenModel.STATUS.NOT_LOGGED);
                });
            });

            describe("getToken", function() {
                it("should return a valid token if exists", function(done) {
                    model.set({
                        'accessToken': 'token'
                    });
                    model.getToken(function(token) {
                        expect(token).toBe('token');
                        done();
                    })
                });

                it("should wait until token exists", function(done) {
                    var waitTime = 500,
                        init = new Date().getTime();

                    model.set({
                        'accessToken': null
                    });

                    model.getToken(function(token) {
                        var elapsedTime = new Date().getTime - init;
                        expect(elapsedTime).not.toBeLessThan(waitTime);
                        expect(model.get('accessToken')).toBe('token');
                        done();
                    });

                    setTimeout(function() {
                        model.set({
                            'accessToken': 'token'
                        });
                    }, waitTime);

                });

            });

            describe("setToken", function() {
                it("should set a valid token", function(done) {
                    model.setToken('token');

                    model.getToken(function(token) {
                        expect(token).toBe('token');
                        done();
                    })
                    expect(model.loadAuthTokenLS()).toBe('token');
                });
            })

        });

    });