require(['./model/me-folder'], function (MeFolderModel) {
    describe("Me Folder Model", function () {
        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify({
                    id: "14375328",
                    nom: "CATALUNYA RADIO",
                    path: "DIGITION/CATALUNYA RADIO",
                    tipus: "FOLDER"
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

            model = new MeFolderModel();

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


        describe("meu usuari carpeta", function () {

            beforeEach(function () {
                model.set({
                    id: '1001'
                });
                model.save();
            });

            it("should do a POST request", function () {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/meu/carpeta');
                expect(request.method).toBe('POST');

            });

            it("should fetch valid data", function (done) {
                var request;

                model.once('change', function () {
                    expect(model.get('id')).toBe('14375328');
                    expect(model.get('nom')).toBe("CATALUNYA RADIO");
                    expect(model.get('path')).toBe("DIGITION/CATALUNYA RADIO");
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid id folder", function (done) {
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