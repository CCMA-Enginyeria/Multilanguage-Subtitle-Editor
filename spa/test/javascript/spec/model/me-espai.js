require(['./model/me-espai'], function (MeEspaiCollection) {
    describe("Me Espai Collection Model", function () {
        var col, responses;
        
        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_me_espai)
            },
            error: {
            	status: 400,
                responseText: JSON.stringify({
                    debugInfo: "debugInfo error",
                    missatge: "Petició incorrecta"
                })
            }
        };
      
        beforeEach(function () {

            jasmine.Ajax.install();

            col = new MeEspaiCollection();

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

        });

        afterEach(function () {
            jasmine.Ajax.uninstall();
        });


        describe("meu usuari espai", function () {

            beforeEach(function () {
            	col.fetch();
            });

            it("should do a GET request", function () {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/meu/grup/espai');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function (done) {
                var request;

                col.once('sync', function () {
                	var val = col.toJSON();
                	expect(val.length).toBe(1);
                    expect(val[0].disponible.percentatge).toBe(50);
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid id grup", function (done) {
                var request;

                col.once('error', function () {
                    expect(col.error.get('debugInfo')).not.toBeNull();
                    expect(col.error.get('missatge')).not.toBeNull();
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);
            });

        });

    });
});