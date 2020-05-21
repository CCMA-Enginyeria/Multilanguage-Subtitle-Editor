require(['./model/folder'], function (FolderModel) {
    describe("Folder Model", function () {
        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_folder)
            },
            error: {
                status: 400,
                responseText: JSON.stringify({
                    debugInfo: "/digition-api-0.1645.0-SNAPSHOT/carpetes/14141414",
                    missatge: "Folder id. not found 14141414"
                })
            }
        };


        beforeEach(function () {

            jasmine.Ajax.install();

            model = new FolderModel();

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


        describe("carpetes", function () {

            beforeEach(function () {
                model.set({
                    id: '1001'
                });
                model.fetch();
            });

            it("should do a GET request", function () {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/carpetes/1001');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function (done) {
                var request;

                model.once('change', function () {
                    expect(model.get('fills').models[0].get('id')).toBe(21285362);
                    expect(model.get('fills').models[0].get('nom')).toBe(".PARAL·LELS");
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
        
        describe("carpetes inews per ordre escaleta", function () {

            beforeEach(function () {
                model.set({
                    id: '1001',
                    ordreSegonsEscaleta : true
                });
                model.fetch();
            });

            it("should do a GET request", function () {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/carpetes/1001?ordreSegonsEscaleta=true');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function (done) {
                var request;

                model.once('change', function () {
                    expect(model.get('fills').models[0].get('id')).toBe(21285362);
                    expect(model.get('fills').models[0].get('nom')).toBe(".PARAL·LELS");
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