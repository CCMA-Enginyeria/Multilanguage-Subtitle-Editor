require(['./model/task-online', './model/notification'],
    function(TaskOnlineModel, NotificationModel) {
        describe("Task Online Model",
            function() {

                var model, responses;

                responses = {
                    success: {
                        status: 200,
                        responseText: JSON.stringify(task_online_mock)
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

                    model = new TaskOnlineModel();
                    model.parentModel = new NotificationModel();

                    model.set({
                        "ids": [25391664],
                        "carpeta": 1551714,
                        "numeroElementsTractar": 1
                    });

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


                describe("to online asset", function() {

                    beforeEach(function() {
                        spyOn(model, "_processTaskComplete");
                        model.save();
                    });

                    it("should do a POST request", function() {

                        var request = jasmine.Ajax.requests.mostRecent();
                        expect(request.url).toBe('http://baseAPI/assets/_hqOnline');
                        expect(request.method).toBe('POST');

                    });

                    it("should get valid data", function(done) {
                        var request;

                        model.once('sync', function() {
                            expect(model.get('numeroElementsTractar')).toBe(1);
                            expect(model.get('ids')[0]).toBe(25391664);
                            expect(model.get('carpeta')).toBe(1551714);
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