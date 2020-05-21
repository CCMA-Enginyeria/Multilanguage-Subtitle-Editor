require(['./model/me', './model/auth-token'],
    function (MeModel, AuthTokenModel) {
        describe("Me Model Integration", function () {
            var model;


            beforeEach(function () {
                window.authTokenModel = new AuthTokenModel();
                model = new MeModel();
            });



            describe("meu", function () {

                beforeEach(function () {
                    model.fetch();
                });


                it("should fetch valid data", function (done) {

                    model.once('change', function () {
                        expect(model.get('digitionIdName')).toBe('PRODUCCIO');
                        done();
                    });

                });

                it("should fecth valid userModel data", function (done) {

                    model.once('change', function () {
                        var user = model.get('usuari');
                        expect(user.get('login')).toBe('digi_tes');
                        expect(user.get('id')).toBe('2699');
                        expect(user.get('nom')).toBe('Proves Digitalització');
                        expect(user.get('cognoms')).toBe('Proves Digitalització');
                        done();
                    });

                });

                it("should fecth valid groupModel data", function (done) {

                    model.once('change', function () {
                        var group = model.get('grup');
                        expect(group.get('id')).toBe('1052');
                        expect(group.get('nom')).toBe('DEL_GIRONA');
                        done();
                    });


                });

                it("should fetch valid folderModel data", function (done) {

                    model.once('change', function () {
                        var folder = model.get('carpeta');
                        expect(folder.get('id')).toBe('4770935');
                        expect(folder.get('nom')).toBe('AUTOMATIC');
                        expect(folder.get('path')).toBe('DIGITION/AUTOMATIC');
                        expect(folder.get('tipus')).toBe('FOLDER');
                        done();
                    });

                });


            });

        });
    });