require(['./model/estrats-type-collection'], 
	function(EstratsTypeCollection) {
        describe("Estrats Types Collection Model", function () {

        	var col, responses;

            responses = {
                success: {
                    status: 200,
                    responseText: JSON.stringify(mock_estrats_type_collection)
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

                col = new EstratsTypeCollection();

                window.authTokenModel = {
                    getToken: function(cb) {
                        cb('token');
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


            describe("Estrats Types Collection Model", function() {

                beforeEach(function() {
                    col.fetch();
                });

                it("should do a GET request", function() {
                    var request = jasmine.Ajax.requests.mostRecent();
                    expect(request.url).toBe('http://baseAPI/tipusEstrats');
                    expect(request.method).toBe('GET');
                });

                it("should fetch valid data", function(done) {
                    var request;

                    col.once('sync', function() {

                        var val = col.toJSON();
                        expect(val.length).toBe(2);
                        expect(val[0].id).toBe('10001');
                        expect(val[0].nom).toBe('DPLA');
                        expect(val[0].descripcio).toBe('Descripció de plans');
                        expect(val[0].mida).toBe(2000);
                        expect(val[0].teKeyframes).toBe(true);
                        
                        expect(val[1].id).toBe('100');
                        expect(val[1].nom).toBe('Video Log');
                        expect(val[1].descripcio).toBe('Digition Videolog');
                        expect(val[1].mida).toBe(2000);
                        expect(val[1].teKeyframes).toBe(true);
                        
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
                
                it("should return formatted estrat types collection", function(done) {
                	var request;
                	
                	var expectedFormattedEstratTypesCol = [{
                		 'id': "10001",
                         'descripcio' : "Descripció de plans"
                	},{
                		'id': "100",
                        'descripcio' : "Digition Videolog"
                	}];
                	
                	col.once('sync', function() {
                		expect(col.getEstratsTypes()).toEqual(expectedFormattedEstratTypesCol);
                		done();
                	});
                	
                	request = jasmine.Ajax.requests.mostRecent();
                    request.respondWith(responses.success);
                });
            });

        });

    });