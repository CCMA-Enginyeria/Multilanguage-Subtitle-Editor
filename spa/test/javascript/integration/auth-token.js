require(['./model/auth-token'],
    function (AuthTokenModel) {
        describe("Auth-token Model Integration", function () {
            var model;

            beforeEach(function () {
                model = new AuthTokenModel();
            });


            describe("login", function () {
                beforeEach(function () {
                    model.login('digi_tes', 'Digites002', 'PRODUCCIO')
                });


                it("should success with valid data", function (done) {

                    model.once('change:status', function () {
                        expect(model.get('accessToken')).toBeDefined();
                        done();
                    });


                });

                it("should fail with invalid data", function (done) {

                    model.once('change:status', function () {
                        expect(model.get('debugInfo')).toBeDefined();
                        expect(model.get('missatge')).toBeDefined();
                        done();
                    });

                });

            });

            describe("logout", function () {
                beforeEach(function () {
                    model.login('digi_tes', 'Digites002', 'PRODUCCIO')
                });
                it("should delete data", function () {
                    model.logout();
                    expect(model.get('accessToken')).toBeFalsy();
                    expect(model.get('status')).toBe(AuthTokenModel.STATUS.NOT_LOGGED);
                });
            });

            describe("getToken", function () {
                it("should return a valid token if exists", function (done) {
                    model.set({
                        'accessToken': 'token'
                    });
                    model.getToken(function (token) {
                        expect(token).toBe('token');
                        done();
                    })
                });

                it("should wait until token exists", function (done) {
                    var waitTime = 500,
                        init = new Date().getTime();

                    model.set({
                        'accessToken': null
                    });

                    model.getToken(function (token) {
                        var elapsedTime = new Date().getTime - init;
                        expect(elapsedTime).not.toBeLessThan(waitTime);
                        expect(model.get('accessToken')).toBe('token');
                        done();
                    });

                    setTimeout(function () {
                        model.set({
                            'accessToken': 'token'
                        });
                    }, waitTime);

                });

            });

        });

    });