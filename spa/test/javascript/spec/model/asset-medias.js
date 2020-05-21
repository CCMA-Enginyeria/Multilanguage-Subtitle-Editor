require(['./model/asset-medias'], function(AssetMedias) {
    describe("AssetMedias Collection ", function() {

        var col, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_asset_medias)
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

            col = new AssetMedias();
            col.parentModel = new Backbone.Model({
                id: 24196948
            });
            col.parentModel.set('tipus', new Backbone.Model({
                id: 10,
                nom: "Vídeo"
            }));

            window.authTokenModel = {
                getToken: function(cb) {
                    cb('token');
                },
                setToken: function(token) {
                }
            };

            window.videoFormatCollection = {
                load: function(cb) {
                    cb();
                },
                findWhere: function() {
                    return new Backbone.Model(mock_asset_media);
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


        describe("medias", function() {

            beforeEach(function() {
                col.fetch();
            });


            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/24196948/medias');
                expect(request.method).toBe('GET');

            });

            it("should fetch valid data", function(done) {
                var request, asset;

                col.once('sync', function() {

                    expect(col.length).toBe(2);
                    expect(col.at(1).get('video')[0].path).toBe("\\\\SSBAIXA5\\VSBAIXA51J\\23622462_20160606061532_SOCCER_COPA_CHIC.WMV");
                    //expect(col.at(0).get('framerate')).toBe(25);
                    //expect(col.at(0).get('aspectratio')).toBe('16:9');

                    asset = col.getHighQuality();
                    expect(asset.get('id')).toBe('41578538');

                    asset = col.getLowQuality();
                    expect(asset.get('id')).toBe('41578758');

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
            
            it("should return well formatted complex data", function(done) {
            	var request, asset;

                col.once('sync', function() {
                    expect(col.getAssetStart()).toBe(39240000000);
                    expect(col.getAssetDuration()).toBe(840000000);
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

        });

    });
});