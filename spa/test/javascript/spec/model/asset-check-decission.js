require(['./model/asset-check-decission', './model/notification'],
	function(AssetCheckDecissionModel, NotificationModel) {
		describe("Asset sendToCard decission Model",
			function() {

				var model, responses;

				responses = {
					success: {
						status: 200,
						responseText: JSON.stringify(mock_asset_check_decission)
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

					model = new AssetCheckDecissionModel();
					model.parentModel = new NotificationModel();

					model.set({
						"ids": ["PRO27740715", "PRO27740495", "PRO27740476"],
						"grupDesti": {
							"id": 27531880
						}
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


				describe("check modal of asset", function() {

					beforeEach(function() {
						model.fetch();
					});

					it("should do a POST request", function() {

						var request = jasmine.Ajax.requests.mostRecent();
						expect(request.url).toBe('http://baseAPI/assets/_checkEnvia');
						expect(request.method).toBe('POST');
						expect(request.params).toBe('{"ids":["PRO27740715","PRO27740495","PRO27740476"],"grupDesti":{"id":27531880}}');
					});

					it("should get valid data", function(done) {
						var request;

						model.once('sync', function() {
							expect(model.get('valor')).toBe(true);
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