require(['./model/camps-collection'], function(CampsCollection) {
    describe("Camps Collection", function() {

        var col, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_camps)
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

            col = new CampsCollection();
            col.setUrlParams({
                vista: 112,
            });

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


        describe(" ordenables", function() {

            beforeEach(function() {
                col.fetch();
            });

            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_camps?vista=112');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request;

                col.once('sync', function() {

                    var val = col.toJSON();
                    expect(val.length).toBe(28);
                    expect(val[4].id).toBe('tipusMaterial');

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                col.once('error', function() {
                    
                    var val = col.toJSON();
                    expect(val.length).toBe(0);
                    expect(col.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

    });
});