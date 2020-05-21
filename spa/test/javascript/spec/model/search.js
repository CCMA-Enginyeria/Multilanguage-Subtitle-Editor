require(['./model/search'], function(SearchModel) {
    describe("Search Model ", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_search)
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

            window.hqStateCollection = {
                get: function(id) {
                    return new Backbone.Model({
                        'estatFinal': true
                    });
                }
            };

            model = new SearchModel();

            model.setSearchParams({
                text: 'Messi',
                opcionsText: 'totes_les_paraules',
                cercaA: 'TOT',
                tipusMaterial: 'AGS',
                grupId: '1001',
                format: 'HD',
                ordre: 'id',
                fromDate: '2017-02-01',
                toDate: '2017-02-20',
                carpetaId: '1',
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


        describe("search result", function() {

            beforeEach(function() {
                model.fetch();
            });

            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();

                expect(request.url).toBe('http://baseAPI/assets/_cerca?text=Messi&opcionsText=totes_les_paraules&cercaA=TOT&tipusMaterial=AGS&grupId=1001&format=HD&ordre=id&fromDate=2017-02-01&toDate=2017-02-20&carpetaId=1&paginaActual=1&itemsPagina=100&disponible=false');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request;

                model.once('sync', function() {

                    expect(model.length).toBe(500);
                    expect(model.at(2).get('id')).toBe('24195696');
                    expect(model.at(3).get('tipusMaterial')).toBe('EDI');

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