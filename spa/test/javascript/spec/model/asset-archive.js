require(['./model/asset-archive', './model/asset'], function (AssetArchive, AssetModel) {
    describe("Asset Mark model", function () {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(asset_archive_mock)
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

            model = new AssetArchive();
            model.parentModel = new Backbone.Model({
                id: 23891424,
                perArxiu: false
            });

            model.set({
                "motiu": "test_motiu"
            });

            window.authTokenModel = {
                getToken: function (cb) {
                    cb('token');
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


        describe("Mark per arxive asset", function () {

            beforeEach(function () {
                model.parentModel.set({
                    perArxiu: true
                });
                model.save();
            });

            it("should do a POST marcar Per arxiu request", function () {

                var request = jasmine.Ajax.requests.mostRecent(),
                    data = request.data();
                expect(request.url).toBe('http://baseAPI/assets/_marcaPerArxiu');
                expect(request.method).toBe('POST');
                expect(data.motiu).toBe('test_motiu');
                expect(data.ids.length).toBe(1);
                expect(data.ids[0]).toBe(23891424);
            });

            it("should get valid data", function (done) {
                var request;

                model.once('sync', function () {
                    expect(model.error).toBe(undefined);
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });


            it("should fail with invalid data", function (done) {
                var request;

                model.once('error', function () {
                    expect(model.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

        describe("UnMark per arxive asset", function () {

            beforeEach(function () {
                model.parentModel.set({
                    perArxiu: false
                });
                model.save();
            });

            it("should do a POST marcar Per arxiu request", function () {

                var request = jasmine.Ajax.requests.mostRecent(),
                    data = request.data();
                expect(request.url).toBe('http://baseAPI/assets/_desmarcaPerArxiu');
                expect(request.method).toBe('POST');
                expect(data.motiu).toBe('test_motiu');
                expect(data.ids.length).toBe(1);
                expect(data.ids[0]).toBe(23891424);

            });

            it("should get valid data", function (done) {
                var request;

                model.once('sync', function () {
                    expect(model.error).toBe(undefined);
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function (done) {
                var request;

                model.once('error', function () {
                    expect(model.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

    });
});