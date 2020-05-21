require(['./model/root-folder'], function (RootFolderModel) {
    describe("Root Folder Model", function () {
        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_root_folder)
            }
        };


        beforeEach(function () {

            jasmine.Ajax.install();

            model = new RootFolderModel();

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
                model.fetch();
            });

            it("should do a GET request", function () {
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/carpetes');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function (done) {
                var request;

                model.once('sync', function () {
                    var content = model.toJSON();
                    expect(content.fills[24].id).toBe(88747);
                    expect(content.fills[24].nom).toBe("INFORMATIUS");
                    expect(content.fills[24].teFills).toBeTruthy();
                    expect(content.fills[24].fills.length).toBe(13);
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });


        });

    });
});