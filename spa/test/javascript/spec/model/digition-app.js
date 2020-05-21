/*globals
    define, ModulJitpub, _, $
*/

require(['./model/digition-app'], function(DigitionApp) {
    describe("Digition App Model ", function() {

        var model, responses;

        responses = {
            success: {
                status: 200,
                responseText: JSON.stringify(mock_versions)
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

            model = new DigitionApp();

            window.PluginLoader = {
                AmINativeNET: function() {
                    return false;
                }
            };


            jitConfig = {
                staticsResourcesHost: '.',
                baseAPI: 'http://baseAPI/',
                version: '3.1717.0',
            };

        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });


        describe(" get versions ", function() {

            beforeEach(function() {
                model.fetch();
            });

            it("should do a GET request", function() {

                var request = jasmine.Ajax.requests.mostRecent();
                expect(request.method).toBe('GET');

            });

            it("should warning new frontend version available", function(done) {
                var request;

                model.once('sync', function() {

                    expect(model.get('versions').app).toBe("-1.17.1401");
                    expect(model.get('update').frontend.data).toBe("02/06/2017 09:00");

                    expect(model.get('frontendUpperVersion')).toBe(true);

                    expect(model.get('updateFrontend')).toBe(true);
                    expect(model.get('updateFrontendInfo')).not.toBeNull();

                    expect(model.get('appLowerMajorVersion')).toBe(false);
                    expect(model.get('appUpperMinorVersion')).toBe(false);
                    expect(model.get('frontendLowerVersion')).toBe(false);
                    expect(model.get('appUpperMinorVersion')).toBe(false);
                    expect(model.get('appLowerMinorVersion')).toBe(false);
                    expect(model.get('appUpperMajorVersion')).toBe(false);
                    expect(model.get('updateApp')).toBe(false);
                    expect(model.get('updateAppInfo')).toBeNull();
                    expect(model.get('updateApi')).toBe(false);
                    expect(model.get('updateApiInfo')).toBeNull();

                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responses.success);
            });

        });

    });
});