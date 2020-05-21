require(['sinon'], function(sinon) {
	/*
	 * -----------------------------------------------
	 * Configuració bàsica
	 * -----------------------------------------------
	 */
	var injector = new Squire();

	/*
	 * -----------------------------------------------
	 * Mock ViewModel
	 * -----------------------------------------------
	 */
	var ViewModel = Backbone.Model.extend({
		changeFormat: sinon.spy(),
		changeNom: sinon.spy(),
		browseFolder: sinon.spy(),
		downloadAssets: sinon.spy(),
		downloadClip: sinon.spy()
	});
	injector.mock('./view-model/asset-download', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */
	var VIEW_MODEL_STATES = {
		LOADING: {
			loading: true
		},
		NO_DOWNLOADABLE: {
			loading: false,
			descarregable: false
		},
		DOWNLOADABLE_WITHOUT_CONFLICTS: {
			loading: false,
			descarregable: true,
			downloadPath: 'downloadPath',
			newAsset: true,
			nomFitxer: 'nomFitxer',
			downloadFormat: 'format_ok',
			videoFormats: [{
				id: 'format_ko',
				nom: 'format ko'
			}, {
				id: 'format_ok',
				nom: 'format ok'
			}],
			formatAvailable: true
		},
		DOWNLOADABLE_WITH_CONFLICTS: {
			loading: false,
			descarregable: true,
			downloadPath: 'downloadPath',
			newAsset: true,
			nomFitxer: 'nomFitxer',
			downloadFormat: 'format_2',
			missatge: "No disponible",
			videoFormats: [{
				id: 'format_1',
				nom: 'format_1'
			}, {
				id: 'format_2',
				nom: 'format_2'
			}],
			videoFormatsHQ: [{
				id: 'format_hq_1',
				nom: 'format_hq_1'
			}, {
				id: 'format_hq_2',
				nom: 'format_hq_2'
			}],
			videoFormatsLQ: [{
				id: 'format_lq_1',
				nom: 'format_lq_1'
			}, {
				id: 'format_lq_2',
				nom: 'format_lq_2'
			}, {
				id: 'format_lq_3',
				nom: 'format_lq_3'
			}],
			formatAvailable: false,
			assetsNotAvailables: [{
				titol: 'titol_1',
				id: 1,
				descarregable: true,
				hq: true,
			}, {
				titol: 'titol_2',
				id: 2,
				descarregable: true,
				hq: false
			}, {
				titol: 'titol_3',
				descarregable: false
			}]
		}
	}

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/asset-download', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Asset Download', function() {
			beforeEach(function(done) {
				this.view = ViewSetup.initialize(View);
				this.view.once('view.render', function() {
					done();
				});
			});
			afterEach(function() {
				//this.view.destroy();
			});
			describe('Render States', function() {
				it('should create the view', function() {
					expect(this.view.$el.hasClass('view-attached')).toBeTruthy();
				});
				it('should not render if loading', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('form').length).toBe(0);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.LOADING);
				});
				it('should show not downloadable label', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('form').length).toBe(1);
						expect(this.view.$el.find('form').html()).toContain('No disponible per a descarrega');
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.NO_DOWNLOADABLE);
				});
				it('should render downloadable asset', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('form').length).toBe(1);
						expect(this.view.$el.find('.browse-folder-action').html()).toBe('downloadPath');
						expect(this.view.$el.find('.R-nom input').val()).toBe('nomFitxer');
						expect(this.view.$el.find('.change-format-action').val()).toBe('format_ok');
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITHOUT_CONFLICTS);
				});
				it('should render format not available asset', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('form').length).toBe(1);
						expect(this.view.$el.find('.browse-folder-action').html()).toBe('downloadPath');
						expect(this.view.$el.find('.R-nom input').val()).toBe('nomFitxer');
						expect(this.view.$el.find('.change-format-action').val()).toBe('format_2');
						expect(this.view.$el.find('.T-assets-no-disponibles').length).toBe(1);

						expect(this.view.$el.find('.R-llistat-fitxers tr').length).toBe(3);
						expect(this.view.$el.find('.R-llistat-fitxers tr:eq(0) td').html()).toBe('titol_1');
						expect(this.view.$el.find('.R-llistat-fitxers tr:eq(0) select option').length).toBe(2);

						expect(this.view.$el.find('.R-llistat-fitxers tr:eq(1) td').html()).toBe('titol_2');
						expect(this.view.$el.find('.R-llistat-fitxers tr:eq(1) select option').length).toBe(3);

						expect(this.view.$el.find('.R-llistat-fitxers tr:eq(2) td').html()).toBe('titol_3');
						expect(this.view.$el.find('.R-llistat-fitxers tr:eq(2) select option').length).toBe(0);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
			});

			describe('Actions and Events', function() {
				it('should change format', function(done) {
					this.view.once('view.render', _.bind(function() {
						this.view.$el.find('.change-format-action').val('format_1').change();
						expect(this.view.viewModel.changeFormat.calledOnce).toBeTruthy();
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
				it('should change name', function(done) {
					this.view.once('view.render', _.bind(function() {
						this.view.$el.find('input#nom').val('test').change();
						expect(this.view.viewModel.changeNom.calledOnce).toBeTruthy();
						expect(this.view.viewModel.changeNom.calledWith('test')).toBeTruthy();
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
				it('should browse folder', function(done) {
					this.view.once('view.render', _.bind(function() {
						this.view.$el.find('.browse-folder-action:eq(0)').click();
						expect(this.view.viewModel.browseFolder.calledOnce).toBeTruthy();
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
				it('should download assets', function(done) {
					this.view.once('view.render', _.bind(function() {
						this.view.$el.trigger('toolbar.downloadAssets');
						expect(this.view.viewModel.downloadAssets.calledOnce).toBeTruthy();
						expect(this.view.viewModel.downloadAssets.calledWithMatch(sinon.match('format_2'), sinon.match([{
							assetId: "1",
							formatId: "format_hq_1"
						}, {
							assetId: "2",
							formatId: "format_lq_1"
						}]))).toBeTruthy();
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
				it('should download clips', function(done) {
					this.view.once('view.render', _.bind(function() {
						this.view.$el.trigger('player-controls.downloadClip');
						expect(this.view.viewModel.downloadClip.calledOnce).toBeTruthy();
						expect(this.view.viewModel.downloadClip.calledWith('format_2', 'nomFitxer')).toBeTruthy();
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
				it('should erase downloadable if confirm', function(done) {
					this.view.once('view.render', _.bind(function() {
						//Si necessitem tocar DOM necessitem un timeout de 100ms per assegurar-nos que la vista està attached
						setTimeout(_.bind(function() {
							var stub = sinon.stub(window.Plugins.App, 'confirm').returns(true);
							this.view.$el.find('.R-llistat-fitxers tr:eq(2) .erase-action').click();
							setTimeout(_.bind(function() {
								expect(this.view.$el.find('.R-llistat-fitxers tr').length).toBe(2);
								stub.restore();
								done();
							}, this), 500);
						}, this), 100);
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
				it('should not erase downloadable if not confirm', function(done) {
					this.view.once('view.render', _.bind(function() {
						setTimeout(_.bind(function() {
							var stub = sinon.stub(window.Plugins.App, 'confirm').returns(false);
							this.view.$el.find('.R-llistat-fitxers tr:eq(2) .erase-action').click();
							setTimeout(_.bind(function() {
								expect(this.view.$el.find('.R-llistat-fitxers tr').length).toBe(3);
								stub.restore();
								done();
							}, this), 500);
						}, this), 100);
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.DOWNLOADABLE_WITH_CONFLICTS);
				});
			});
		});
	});
});