require(['./model/me-favorit-collection'], function (MeFavoritCollection) {
    describe("Me Favorit Collection", function () {

        var collection, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_me_favorit_collection)
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

            collection = new MeFavoritCollection();

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

            collection.fetch();
        });

        afterEach(function () {
            jasmine.Ajax.uninstall();
        });

        it("should do a GET request", function () {

            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('http://baseAPI/meu/favorits/carpetes');
            expect(request.method).toBe('GET');

        });

        it("should fetch valid data", function (done) {
            var request;

            collection.once('sync', function () {

                expect(collection.length).toBe(4);

                var fav = collection.first();

                expect(fav.get('id')).toBe("14768015");
                expect(fav.get('idFav')).toBe(401);
                expect(fav.get('carpetaFav').id).toBe("14768015");
                expect(fav.get('carpetaFav').detallRuta[1].nom).toBe("CASTINGS");

                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responses.success);
        });

        it("should fail with invalid data", function (done) {
            var request;

            collection.once('error', function () {
                expect(collection.length).toBe(0);
                expect(collection.error.get('missatge')).toBe('missatge error');
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responses.error);

        });

    });
});