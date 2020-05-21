require(['sinon', './view-model/folder', '../../../../test/javascript/common/model-templates', './model/folder'], function(sinon, FolderViewModel, ModelTemplates) {
    describe("Folder View Model", function() {

        var folderViewModel;
        var options = [];
        var spy_model;
        var spy_preferences;
        var spy_reset;

        describe("folders defaults", function() {
            beforeEach(function() {
                ModelTemplates.inicializeMeModel();
                ModelTemplates.inicializeFolderModel("RUNDOWN");

                options.model = folderModel;
                options.isMeFolderSelector = false;

                folderViewModel = new FolderViewModel(null, options);
            });

            it("should correct rundown inicialized data", function() {
                var data = folderViewModel.toJSON();
                expect(data.contextItems).toEqual({
                    ordenacio_alfabetica: {
                        name: 'ordenació alfabètica',
                        icon: '',
                        className: 'alfabetica'
                    },
                    ordenacio_rundown: {
                        name: 'ordenació segons escaleta',
                        icon: '',
                        className: ''
                    },
                    sep1: '---------',
                    refresc: {
                        name: 'refresca',
                        icon: 'refrescar',
                        className: 'refresca'
                    },
                    informacio: {
                        name: 'informació',
                        icon: 'informacio',
                        className: 'informacio'
                    },
                   sep2:'---------',
                   afegir_favorits:{  
                        name:'afegir a favorits',
                        icon:'favorits',
                        className:'favorits'
                    }
                });
                expect(data.isMeFolderSelector).toBe(false);
                expect(data.isfocused).toBe(undefined)
                expect(data.folderClass).toBe('escaleta');
                expect(data.id).toBe(1001);
                expect(data.isblau).toBe(false);
                expect(data.isloading).toBe(false); // al fer _onModelChange pasa a ser false
                expect(data.isopen).toBe(undefined);
                expect(data.isselected).toBe(true);
                expect(data.name).toBe('INGESTES');
                expect(data.showInfo).toBe(false);
                expect(data.type).toBe('RUNDOWN');
                expect(data.sortBy).toBe('rundown');
            });
        });

        describe("folder model listeners", function() {
            beforeEach(function() {
                ModelTemplates.inicializeMeModel();
                ModelTemplates.inicializeFolderModel("RUNDOWN");

                options.model = folderModel;
                options.isMeFolderSelector = false;

                spy_model = sinon.spy(FolderViewModel.prototype, '_onModelChanged');
                spy_preferences = sinon.spy(FolderViewModel.prototype, '_onMePreferencesSortFolderChange');
                spy_reset = sinon.spy(FolderViewModel.prototype, '_onModelReset');
                folderViewModel = new FolderViewModel(null, options);
            });

            afterEach(function() {
                folderViewModel._onModelChanged.restore();
                folderViewModel._onMePreferencesSortFolderChange.restore();
                folderViewModel._onModelReset.restore();
            });

            it("should execute listener callback when change:oberta event trigger", function(done) {
                folderModel.trigger('change:oberta');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when sync event trigger", function(done) {
                folderModel.trigger('sync');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when fills sync event trigger", function(done) {
                folderModel.trigger('fills.sync');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when detall sync event trigger", function(done) {
                folderModel.trigger('detall.sync');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when carpeta change:id event trigger", function(done) {
                window.meModel.trigger('carpeta.change:id');
                setTimeout(function() {
                    expect(spy_model.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when reset event trigger", function(done) {
                folderModel.trigger('reset');
                setTimeout(function() {
                    expect(spy_reset.calledOnce).toBeTruthy();
                    done();
                }, 0);
            });

            it("should execute listener callback when preferencies sync event trigger", function(done) {
                window.meModel.trigger('preferencies.sync');
                setTimeout(function() {
                    expect(spy_preferences.calledTwice).toBeTruthy();
                    done();
                }, 0);
            });
        });

        describe("folder functions", function() {
            describe("_prepareContextItems for ROOT-FOLDER type", function() {
                beforeEach(function() {
                    ModelTemplates.inicializeMeModel();
                    ModelTemplates.inicializeFolderModel("ROOT-FOLDER");

                    options.model = folderModel;
                    options.isMeFolderSelector = false;

                    folderViewModel = new FolderViewModel(null, options);
                });

                it("should prepare context items", function(done) {
                    var contextItems = folderViewModel._prepareContextItems();
                    expect(contextItems).toEqual({
                        refresc: {
                            name: 'refresca',
                            icon: 'refrescar',
                            className: 'refresca'
                        },
                        sep2:'---------',
                        afegir_favorits:{  
                            name:'afegir a favorits',
                            icon:'favorits',
                            className:'favorits'
                        }
                    });
                    done();
                });
            });

            describe("_prepareContextItems for FOLDER type", function() {
                beforeEach(function() {
                    ModelTemplates.inicializeMeModel();
                    ModelTemplates.inicializeFolderModel("FOLDER");

                    options.model = folderModel;
                    options.isMeFolderSelector = false;

                    folderViewModel = new FolderViewModel(null, options);
                });

                it("should prepare context items", function(done) {
                    var contextItems = folderViewModel._prepareContextItems();
                    expect(contextItems).toEqual({
                        selecciona_carret: {
                            name: 'selecciona carret',
                            icon: 'carro',
                            className: 'bold'
                        },
                        sep1: '---------',
                        refresc: {
                            name: 'refresca',
                            icon: 'refrescar',
                            className: 'refresca'
                        },
                        informacio: {
                            name: 'informació',
                            icon: 'informacio',
                            className: 'informacio'
                        },
                        sep2:'---------',
                        afegir_favorits:{  
                            name:'afegir a favorits',
                            icon:'favorits',
                            className:'favorits'
                        }
                    });
                    done();
                });
            });

            describe("_prepareContextItems when me folder selector", function() {
                beforeEach(function() {
                    ModelTemplates.inicializeMeModel();
                    ModelTemplates.inicializeFolderModel("RUNDOWN");

                    options.model = folderModel;
                    options.isMeFolderSelector = true;

                    folderViewModel = new FolderViewModel(null, options);
                });

                it("should prepare context items", function(done) {
                    var contextItems = folderViewModel._prepareContextItems();
                    expect(contextItems).toEqual({
                        ordenacio_alfabetica: {
                            name: 'ordenació alfabètica',
                            icon: '',
                            className: 'alfabetica'
                        },
                        ordenacio_rundown: {
                            name: 'ordenació segons escaleta',
                            icon: '',
                            className: ''
                        },
                        sep2:'---------',
                        afegir_favorits:{  
                            name:'afegir a favorits',
                            icon:'favorits',
                            className:'favorits'
                        }
                    });
                    done();
                });
            });

            describe("_getFolderClass for UNKNOWN type", function() {
                beforeEach(function() {
                    ModelTemplates.inicializeMeModel();
                    ModelTemplates.inicializeFolderModel("UNKNOWN");

                    options.model = folderModel;
                    options.isMeFolderSelector = false;

                    folderViewModel = new FolderViewModel(null, options);
                });

                it("should prepare context items", function(done) {
                    var tipus = folderViewModel._getFolderClass();
                    expect(tipus).toBe('desconegut');
                    done();
                });
            });

        });

        describe("folder actions", function() {
            beforeEach(function() {
                ModelTemplates.inicializeMeModel();
                ModelTemplates.inicializeFolderModel("RUNDOWN");

                options.model = folderModel;
                options.isMeFolderSelector = true;

                folderViewModel = new FolderViewModel(null, options);
            });

            it("change short folder must set sortBy", function(done) {
                folderViewModel.once('change', function() {
                    var data = folderViewModel.toJSON();
                    expect(data.sortBy).toBe('alphabetically');
                    done();
                });

                folderViewModel.sortFolderBy('alphabetically');
            });
        })
    });
});
