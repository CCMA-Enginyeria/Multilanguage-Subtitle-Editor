require(['./model/hqstate-collection'], function (HqStateCollection) {
    describe("HqState Collection Model", function () {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_hqstate_collection)
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

            model = new HqStateCollection();

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
            expect(request.url).toBe('http://baseAPI/hqEstats');
            expect(request.method).toBe('GET');

        });

        it("should fetch valid data", function (done) {
            var request;

            model.once('sync', function () {

                expect(model.length).toBe(21);

                var estat205 = model.get('1');

                expect(estat205.get('descripcio')).toBe('verd: Disponible');
                expect(estat205.get('tipus')).toBe('online');
                expect(estat205.get('estatFinal')).toBe(true);

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