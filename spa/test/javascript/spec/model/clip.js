require(['./model/clip'], function(ClipModel) {
    describe("Clip Model ", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_clip)
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

        describe("create simple clip", function() {

            beforeEach(function() {
            	
            	model = new ClipModel();
            	model.set({
                    "frameRate": 25,
                    "id": 1234,
                    "desti": 1001,
                    "destiGrup": 1002,
                    "tc_in" : "00:00:01:00",
                    "tc_out" : "00:00:02:00",
                    "titol": "titol_clip",
                    "tipusMaterial": null,
                    "dataCaducitat": null,
                    "perArxiu": null,
                    "tallarClip": null,
                    "permisos": null
                });
            	
                model.save();
            });

            it("should do a POST request without all parameters", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_envia');
                expect(request.method).toBe('POST');
                expect(request.data()).toEqual({'id':1234,'online':true,'desti':{'digition':'PRODUCCIO','carpeta':1001,'grup':1002},'clip':{'start':{'nanos':1000000000,'tc':'00:00:01:00'},'stop':{'nanos':2000000000,'tc':'00:00:02:00'},'titol':'titol_clip'}});
            });
            
            
            

            it("should get valid data", function(done) {
                var request;

                model.once('sync', function() {
                    expect(model.get('id')).toBe('25391456');
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
        
        describe("create full clip", function() {
        	
        	
        	beforeEach(function() {
        		
        		model = new ClipModel();
            	model.set({
                    "frameRate": 25,
                    "id": 1234,
                    "desti": 1001,
                    "destiGrup": 1002,
                    "tc_in" : "00:00:01:00",
                    "tc_out" : "00:00:02:00",
                    "titol": "titol_clip",
                    "tipusMaterial": "TRB",
                    "dataCaducitat": "2018-05-31T00:00:00+02:00",
                    "perArxiu": true,
                    "tallarClip": false,
                    "permisos": "504"
                });
            	
                model.save();
            });
        	
            it("should do a POST request with all parameters", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.url).toBe('http://baseAPI/assets/_envia');
                expect(request.method).toBe('POST');
                expect(request.data()).toEqual({'id':1234,'online':true,'desti':{'digition':'PRODUCCIO','carpeta':1001,'grup':1002},'clip':{'start':{'nanos':1000000000,'tc':'00:00:01:00'},'stop':{'nanos':2000000000,'tc':'00:00:02:00'},'titol':'titol_clip',titol: 'titol_clip', tipusMaterial: 'TRB', dataCaducitat: '2018-05-31T00:00:00+02:00', perArxiu: true, tallarClip: false, permisos: '504'}});
            });
        });

    });
});