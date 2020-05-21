require(['./model/estrats-search'], function(EstratsSearchModel) {
    describe("Estrats Search Model ", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_estrats_search)
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

            model = new EstratsSearchModel();

            model.setSearchParams({
                text: 'HD',
                opcionsText: 'totes_les_paraules',
                tipusId: '10001',
                assetId: '23795009'
            });

            window.hqStateCollection = {
                get: function(id) {
                    return new Backbone.Model({
                        'estatFinal': true
                    });
                }
            };
            
            window.authTokenModel = {
                getToken: function(cb) {
                    cb('token');
                },
                setToken: function(token) {
                }
            };

            window.estratsTypeCollection = {
                    load: function(cb) {
                        cb();
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


        describe("estrats search result", function() {

            beforeEach(function() {
                model.fetch();
            });

            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();

                expect(request.url).toBe('http://baseAPI/estrats/_cerca?text=HD&opcionsText=totes_les_paraules&tipusId=10001&assetId=23795009');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request;

                model.once('sync', function() {

                    expect(model.length).toBe(1);
                    expect(model.at(0).get('id')).toBe('350519253_10001_1');
                    expect(model.at(0).get('descripcio')).toBe('EQUIP HD-Placa Maria Cristina');
                    expect(model.at(0).get('start')['tc']).toBe('00:00:00:00');
                    expect(model.at(0).get('stop')['tc']).toBe('00:05:48:15');
                    expect(model.at(0).get('durada')['tc']).toBe('00:05:48:15');

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                model.once('error', function() {
                    expect(model.length).toBe(0);
                    expect(model.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

    });
});