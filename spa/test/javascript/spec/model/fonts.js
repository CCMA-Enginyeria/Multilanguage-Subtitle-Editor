require(['./model/fonts'], function (FontsCollection) {
    describe("Fonts Collection Model", function () {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_fonts)
            },
            error: {
                status: 400,
                responseText: JSON.stringify({
                    debugInfo: "debugInfo error",
                    missatge: "missatge error"
                })
            }
        };

        beforeEach(function () {

            jasmine.Ajax.install();

            model = new FontsCollection();

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
            expect(request.url).toBe('http://baseAPI/fontsOrigen');
            expect(request.method).toBe('GET');

        });

        it("should fetch valid data", function (done) {
            var request;

            model.once('sync', function () {

                expect(model.length).toBe(26);

                var font = model.get('16');

                expect(font.get('nom')).toBe('DIAGONAL TV');

                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responses.success);
        });

        it("should fail with invalid data", function (done) {
            var request;

            model.once('error', function () {
                expect(model.length).toBe(0);
                expect(model.error.get('missatge')).toBe('missatge error');
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responses.error);

        });

    });
});