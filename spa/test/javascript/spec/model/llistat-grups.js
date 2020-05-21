require(['./model/llistat-grups'], function(GrupsCollection) {
    describe("Llistat grups ", function() {

        var col, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_llistat_grups)
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

            col = new GrupsCollection();

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


        describe("grups", function() {

            beforeEach(function() {
                col.fetch();
            });

            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/grups');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request;

                col.once('sync', function() {

                    expect(col.length).toBe(133);
                    expect(col.at(2).get('id')).toBe('1047');
                    expect(col.at(2).get('nom')).toBe('30_MINUTS');

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                col.once('error', function() {
                    expect(col.length).toBe(0);
                    expect(col.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

    });
});