require(['sinon', './view-model/estrats-list', '../../../../test/javascript/common/model-templates'], function(sinon, EstratsListViewModel, ModelTemplates) {
    describe("Estrats List View Model", function() {

        var estratsListViewModel;
        var options;
        var EstratsCollection;
        var estrats;
        var clipboard;
        var Medias;
        var media;

        beforeEach(function() {
            ModelTemplates.inicializeMeModel();

            EstratsCollection = Backbone.Collection.extend({
                getEstrats: function() {
                    return null;
                }
            });

            Medias = Backbone.Model.extend({
                getAssetDuration: function() {
                    return null;
                },
                getAssetStart: function() {
                    return null;
                }
            });

            estrats = new EstratsCollection();
            clipboard = new EstratsCollection();
            media = new Medias();

            options = {
                "model": estrats,
                "clipboard": clipboard,
                "medias": media
            };
            estratsListViewModel = new EstratsListViewModel(null, options);
        });


        it("should have default data", function() {

            var data = estratsListViewModel.toJSON();

            expect(data.estrats).toBe(null);
            expect(data.loadingText).toBe(null);
            expect(data.durada).toBe(null);
            expect(data.inici).toBe(null);
        });

        describe("estrats list view-model listeners", function() {
            beforeEach(function() {
                ModelTemplates.inicializeMeModel();
                EstratsCollection = Backbone.Collection.extend({
                    getEstrats: function() {
                        return null;
                    }
                });

                Medias = Backbone.Model.extend({
                    getAssetDuration: function() {
                        return null;
                    },
                    getAssetStart: function() {
                        return null;
                    }
                });

                estrats = new EstratsCollection();
                clipboard = new EstratsCollection();
                media = new Medias();

                options = {
                    "model": estrats,
                    "clipboard": clipboard,
                    "medias": media
                };

                spy_model = sinon.spy(EstratsListViewModel.prototype, 'onModelChange');
                spy_reset = sinon.spy(EstratsListViewModel.prototype, 'onMeModelSearchEstratsReset');
                spy_change = sinon.spy(EstratsListViewModel.prototype, 'onMeModelSearchEstratsChange');

                estratsListViewModel = new EstratsListViewModel(null, options);
            });

            afterEach(function() {
                estratsListViewModel.onModelChange.restore();
                estratsListViewModel.onMeModelSearchEstratsReset.restore();
                estratsListViewModel.onMeModelSearchEstratsChange.restore();
            });

            it("should execute listener callback when sync event trigger", function(done) {
                estrats.trigger('sync');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when error event trigger", function(done) {
                estrats.trigger('error');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });
        });
    });
});