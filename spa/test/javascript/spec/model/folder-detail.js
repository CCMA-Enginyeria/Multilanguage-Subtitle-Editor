require(['./model/folder-detail',
        './model/folder'
    ],
    function (FolderDetail, FolderModel) {
        describe("Folder Detail Model", function () {
            var model, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_folder_info)
                },
                error: {
                    status: 400,
                    responseText: JSON.stringify({
                        debugInfo: "/digition-api-0.1645.0-SNAPSHOT/carpetes/14141414/detall",
                        missatge: "Folder id. not found 14141414"
                    })
                }
            };


            beforeEach(function () {

                jasmine.Ajax.install();

                model = new FolderDetail();
                model.parentModel = new FolderModel();
                model.parentModel.set({
                    id: '1001'
                });

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
                    expect(request.url).toBe('http://baseAPI/carpetes/1001/detall');
                    expect(request.method).toBe('GET');

                });

                it("should fetch valid data", function (done) {
                    var request;

                    model.once('change', function () {
                        expect(model.get('creat').get('data')).toBe('2002-04-10 10:25:43');
                        expect(model.get('modificat').get('usuari').get('login')).toBe("sanc_pac");
                        expect(model.get('creat').get('data')).toBe('2002-04-10 10:25:43');

                        expect(model.get('modificat').get('usuari').get('nom')).toBe("Paco");
                        expect(model.get('modificat').get('usuari').get('cognoms')).toBe("Sanchez");

                        expect(model.get('creat').get('usuari').get('nom')).toBe("Digi");
                        expect(model.get('creat').get('usuari').get('cognoms')).toBe("tion");

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