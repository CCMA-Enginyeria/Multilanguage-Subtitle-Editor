require(['./model/task-delete', './model/notification'], function(TaskDeleteModel, NotificationModel) {
    describe("Task Delete Model", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(task_delete_mock)
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

            model = new TaskDeleteModel();
            model.parentModel = new NotificationModel();
            model.set({
                "ids": [23964334],
                "carpeta": {"id": 21681595}
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


        describe("delete asset", function() {

            beforeEach(function() {
                model.save();
            });

            it("should do a POST request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_treu');
                expect(request.method).toBe('POST');

            });

            it("should get valid data", function(done) {
                var request;
                var carpeta = {"id": 21681595 };

                model.once('sync', function() {
                	expect(model.get('ids')[0]).toBe(23964334);
                	expect(model.get('carpeta')[Object.keys(model.get('carpeta'))[0]]).toBe(carpeta[Object.keys(carpeta)[0]]);
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