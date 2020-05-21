require(['./model/asset-collection',
        './model/folder'
    ],
    function(AssetCollection, FolderModel) {
        describe("Asset Collection Model", function() {



            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_asset_collection)
                },
                error: {
                    status: 400,
                    responseText: JSON.stringify({
                        debugInfo: "/digition-api-0.1648.0-PTF-SNAPSHOT/assets?carpetaId=4770935&paginaActual=1&itemsPagina=20",
                        missatge: "CarpetaId not found 4770935"
                    })
                }
            };

            beforeEach(function() {

                jasmine.Ajax.install();
                model = new AssetCollection();
                model.parentModel = new FolderModel({
                    id: '329151'
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


            describe("Asset Model", function() {

                beforeEach(function() {
                    window.hqStateCollection = new Backbone.Collection;
                    model.fetch();
                });

                it("should do a GET request", function() {

                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/assets?carpetaId=329151&paginaActual=1&itemsPagina=5000');
                    expect(request.method).toBe('GET');

                });


                it("should fetch valid data", function(done) {
                    var request;

                    model.once('sync', function() {

                        expect(model.parentModel.get('id')).toBe('329151');

                        expect(model.length).toBe(1);

                        expect(model.at(0).get('id')).toBe('PRO24194481');
                        expect(model.at(0).get('dataCaducitat')).toBe('2016-09-26 22:00:00');

                        //existen submodelos
                        expect(model.at(0).get('tipus').get('id')).toBe('11');

                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fail with invalid data", function(done) {
                    var request;

                    model.once('error', function() {
                        expect(model.length).toBe(0);
                        expect(model.error.get('missatge')).toBe('CarpetaId not found 4770935');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.error);

                });

            });



            describe("Asset Paginator ", function() {

                beforeEach(function() {
                    //Mockeamos AssetModel
                    model.model = Backbone.Model;
                    model.fetch();
                });

                it("should fetch valid data", function(done) {
                    var request;

                    model.once('sync', function() {

                        expect(model.paginacio.get('paginaActual')).toBe(1);

                        model.nextPage();
                        expect(model.paginacio.get('paginaActual')).toBe(2);

                        model.prevPage();
                        expect(model.paginacio.get('paginaActual')).toBe(1);

                        model.beginPage();
                        expect(model.paginacio.get('paginaActual')).toBe(1);

                        model.endPage();
                        expect(model.paginacio.get('paginaActual')).toBe(10);

                        model.reset();
                        expect(model.paginacio.get('paginaActual')).toBe(1);

                        model.nextPage();
                        expect(model.paginacio.get('paginaActual')).toBe(2);

                        setTimeout(done, 350); // el fetch está debounced
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

            });

        });

    });