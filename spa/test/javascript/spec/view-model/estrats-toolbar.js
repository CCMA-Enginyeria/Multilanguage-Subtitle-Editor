require(['sinon', './view-model/estrats-toolbar', '../../../../test/javascript/common/model-templates', '../../../../test/javascript/common/global-templates'], function(sinon, EstratsToolbarViewModel, ModelTemplates, GlobalTemplates) {
    describe("Estrats Toolbar View Model", function() {

        var estratsToolbarViewModel;
        var options;
        var EstratsCollection;
        var estrats;
        var clipboard;

        beforeEach(function() {
            ModelTemplates.inicializeMeModel();
            GlobalTemplates.inicializedCollectionsAndPlugins();

            EstratsCollection = Backbone.Collection.extend({
                getEstrats: function() {
                    return null;
                }
            });

            estrats = new EstratsCollection();
            clipboard = new EstratsCollection();

            options = {
                "model": estrats,
                "clipboard": clipboard
            };
            estratsToolbarViewModel = new EstratsToolbarViewModel(null, options);
        });


        it("should have default data", function() {
            var data = estratsToolbarViewModel.toJSON();

            expect(data.tipusEstrats.length).toBe(1);
            expect(data.tipusEstrats.at(0).attributes['id']).toBe('id');
            expect(data.tipusEstrats.at(0).attributes['nom']).toBe('nom');
            expect(data.tipusEstrats.at(0).attributes['descripcio']).toBe('descripcio');
            expect(data.tipusEstrats.at(0).attributes['mida']).toBe('mida');
            expect(data.tipusEstrats.at(0).attributes['teKeyframes']).toBe(true);
            expect(data.crearClipDeshabilitat).toBe(true);
            expect(data.selectedTipusId).toBe(null);
            expect(data.selectedOptionsText).toBe(null);
            expect(data.clipboardSize).toBe(0);
            expect(data.selected).toBe('none');
        });

        describe("Estrats toolbar listeners", function() {
            beforeEach(function() {
                ModelTemplates.inicializeMeModel();
                GlobalTemplates.inicializedCollectionsAndPlugins();

                EstratsCollection = Backbone.Collection.extend({
                    getEstrats: function() {
                        return null;
                    }
                });

                estrats = new EstratsCollection();
                clipboard = new EstratsCollection();
                options = {
                    "model": estrats,
                    "clipboard": clipboard
                };

                spy_model_change = sinon.spy(EstratsToolbarViewModel.prototype, 'onEstratsTypeModelChange');
                spy_clipboard_change = sinon.spy(EstratsToolbarViewModel.prototype, 'onClipboardChange');

                estratsToolbarViewModel = new EstratsToolbarViewModel(null, options);
            });

            afterEach(function() {
                estratsToolbarViewModel.onEstratsTypeModelChange.restore();
                estratsToolbarViewModel.onClipboardChange.restore();
            });

            it("should execute listener callback when sync estratsTypeCollection event trigger", function(done) {
                window.estratsTypeCollection.trigger('sync');
                setTimeout(function() {
                    expect(spy_model_change.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when change clipboard event trigger", function(done) {
                clipboard.trigger('change');
                setTimeout(function() {
                    expect(spy_clipboard_change.calledOnce).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when add clipboard event trigger", function(done) {
                clipboard.trigger('add');
                setTimeout(function() {
                    expect(spy_clipboard_change.calledOnce).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when remove clipboard event trigger", function(done) {
                clipboard.trigger('remove');
                setTimeout(function() {
                    expect(spy_clipboard_change.calledOnce).toBeTruthy();
                    done();
                }, 0);
            });
        });
    });
});