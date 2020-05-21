require(['./model/estrats-collection', './model/asset'], 
	function(EstratsCollection, AssetModel) {
        describe("Estrats Collection Model", function () {

        	var col, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_estrats_collection)
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

                col = new EstratsCollection();
                col.parentModel = new AssetModel({
                    id: '2'
                });
                
                col.tipusId = 10001;

                window.authTokenModel = {
                    getToken: function(cb) {
                        cb('token');
                    }
                };
                
                window.estratsTypeCollection = {
                        load: function(cb) {
                            cb();
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


            describe("Estrats Collection Model", function() {

                beforeEach(function() {
                    col.fetch();
                });

                it("should do a GET request", function() {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/estrats?assetId=2&tipusId=10001');
                    expect(request.method).toBe('GET');
                });

                it("should fetch valid data", function(done) {
                    var request;

                    col.once('sync', function() {

                        var val = col.toJSON();
                        expect(val.length).toBe(2);
                        expect(val[0].id).toBe('1');
                        expect(val[0].descripcio).toBe('descripcio1');
                        expect(val[0].start.tc).toBe('08:42:57:11');
                        expect(val[0].stop.tc).toBe('08:43:30:17');
                        expect(val[0].durada.tc).toBe('00:00:33:06');
                        expect(val[0].keyframe.url).toBe('url_imagen1');
                        
                        expect(val[1].id).toBe('2');
                        expect(val[1].descripcio).toBe('descripcio2');
                        expect(val[1].start.tc).toBe('08:44:01:21');
                        expect(val[1].stop.tc).toBe('08:44:47:01');
                        expect(val[1].durada.tc).toBe('00:00:45:05');
                        expect(val[1].keyframe.url).toBe('url_imagen2');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });

                it("should fail with invalid data", function(done) {
                    var request;

                    col.once('error', function() {
                        
                        var val = col.toJSON();
                        expect(val.length).toBe(0);
                        expect(col.error.get('missatge')).toBe('missatge error');
                        done();
                    });

                    request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.error);

                });
                
                it("should return formatted estrats collection", function(done) {
                	var request;
                	
                	var expectedFormattedEstratsCol = [{
                		 'id': "1",
                         'descripcio' : "descripcio1",
                         'start': {
                        	 "nanos": 31377440000000,
                   	      	 "tc": "08:42:57:11"
                         },
                         'stop': {
                        	 "nanos": 31410680000000,
                   	      	 "tc": "08:43:30:17"
                         },
                         'durada': {
                        	 "nanos": 33240000000,
                   	         "tc": "00:00:33:06"
                         },
                         'keyframe': "url_imagen1"
                	},{
                		'id': "2",
                        'descripcio' : "descripcio2",
                        'start': {	
                        	"nanos": 31441840000000,
                  	      "tc": "08:44:01:21"
                        },
                        'stop': {
                        	"nanos": 31487040000000,
                  	      "tc": "08:44:47:01"
                		},
                        'durada': {
                        	"nanos": 45200000000,
                  	        "tc": "00:00:45:05"
                        },
                        'keyframe': "url_imagen2"
                	}];
                	
                	col.once('sync', function() {
                		expect(col.getEstrats()).toEqual(expectedFormattedEstratsCol);
                		done();
                	});
                	
                	request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });
            });

        });

    });