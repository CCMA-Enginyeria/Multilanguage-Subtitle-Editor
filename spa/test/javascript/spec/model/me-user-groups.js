require(['./model/me-user-groups'], function(MeUserGroupsCollection) {
    describe("Me User Groups Model", function() {
        var groupsCol, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_me_user_groups)
            },
            error: {
                status: 401,
                responseText: JSON.stringify({
                    debugInfo: "Usuari desconegut o contrasenya errònia",
                    missatge: "Accés denegat per falta de credencials"
                })
            }
        };


        beforeEach(function() {

            jasmine.Ajax.install();

            groupsCol = new MeUserGroupsCollection();

            window.authTokenModel = {
                getToken: function(cb) {
                    cb('token');
                },
                setToken: function(token) {}
            };

            jitConfig = {
                staticsResourcesHost: '.',
                baseAPI: 'http://baseAPI/'
            };

        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });


        describe("meu usuari grups", function() {

            beforeEach(function() {
                groupsCol.fetch();
            });

            it("should do a GET request", function() {
                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/meu/usuari/grups');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request;

                groupsCol.once('sync', function() {
                    var content = groupsCol.toJSON();
                    expect(content[0].id).toBe(1017);
                    expect(content[0].nom).toBe("24h maqueta");
                    expect(content[45].id).toBe(1223);
                    expect(content[45].nom).toBe("Disseny Caracterització");
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

        });

    });
});