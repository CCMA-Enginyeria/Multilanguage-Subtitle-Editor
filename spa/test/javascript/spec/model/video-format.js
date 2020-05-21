require(['./model/video-format-collection'], function(VideoFormats) {
    describe("VideoFormat Collection ", function() {

        var col, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_video_format)
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

            col = new VideoFormats();



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


        describe("formats", function() {

            beforeEach(function() {
                col.fetch();
            });

            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/videoFormats');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request;

                col.once('sync', function() {

                    expect(col.length).toBe(2);
                    expect(col.at(1).get('id')).toBe('20');
                    expect(col.at(0).get("presets")[0].frameRate).toBe(25);

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

            it("should fail with invalid data", function(done) {
                var request;

                col.once('error', function() {
                    expect(col.length).toBe(0);
                    expect(col.error.get('missatge')).toBe('missatge error');
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.error);

            });
        });

    });
});