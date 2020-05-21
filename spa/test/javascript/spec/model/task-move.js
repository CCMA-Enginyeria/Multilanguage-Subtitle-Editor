require(['./model/task-move', './model/notification'], function(TaskMoveModel, NotificationModel) {
    describe("Task Move Model", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(task_move_mock)
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

            model = new TaskMoveModel();
            model.parentModel = new NotificationModel();
            model.set({
                "ids": [25391664],
                "carpetaOrigen": {"id": 1551714} ,
                "carpetaDesti": {"id": 01102017},
                "numeroElementsTractar" : 1,
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


        describe("move asset", function() {

            beforeEach(function() {
                model.save();
            });

            it("should do a POST request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_mou');
                expect(request.method).toBe('POST');

            });

            it("should get valid data", function(done) {
                var request;
                var carpetaOrigen = {"id": 1551714 };
                var carpetaDesti = {"id": 01102017 };
                                
                model.once('sync', function() {
                	expect(model.get('numeroElementsTractar')).toBe(1);
                	expect(model.get('ids')[0]).toBe(25391664);
                	expect(model.get('carpetaOrigen')[Object.keys(model.get('carpetaOrigen'))[0]]).toBe(carpetaOrigen[Object.keys(carpetaOrigen)[0]]);
                	expect(model.get('carpetaDesti')[Object.keys(model.get('carpetaDesti'))[0]]).toBe(carpetaDesti[Object.keys(carpetaDesti)[0]]);
                	done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                model.once('error', function() {
                    expect(model.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

    });
});