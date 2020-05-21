require(['./model/me-group'], function (MeGroupModel) {
    describe("Me Group Model", function () {
        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify({
                    "id": 1001,
                    "nom": "Informatius"
                })
            },
            error: {
                status: 400,
                responseText: JSON.stringify({
                    debugInfo: "Failed to convert value of type [java.lang.String] to required type [java.lang.Integer];",
                    missatge: "El paràmetre d'entrada no és del tipus esperat."
                })
            }
        };


        beforeEach(function () {

            jasmine.Ajax.install();

            model = new MeGroupModel();

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


        describe("meu usuari grups", function () {

            beforeEach(function () {
                model.set({
                    grupId: '1001'
                });
                model.fetch();
            });

            it("should do a GET request", function () {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/autenticacio/canviaGrup?grupId=1001');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function (done) {
                var request;

                model.once('change', function () {
                    expect(model.get('id')).toBe(1001);
                    expect(model.get('nom')).toBe("Informatius");
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid id grup", function (done) {
                var request;

                model.once('error', function () {
                    expect(model.error.get('debugInfo')).not.toBeNull();
                    expect(model.error.get('missatge')).not.toBeNull();
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);
            });

        });

    });
});