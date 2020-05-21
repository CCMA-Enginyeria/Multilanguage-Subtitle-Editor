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
		setTitol: sinon.spy(),
		setTipusMaterial: sinon.spy(),
		setPermisos: sinon.spy(),
		setGrup: sinon.spy(),
		setDataCaducitat: sinon.spy(),
		setTallarClip: sinon.spy(),
		setPerArxiu: sinon.spy(),
		setToOnline: sinon.spy(),
		createClip: sinon.spy()
	});
	injector.mock('./view-model/clip-creator', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */
	
	var VIEW_MODEL_STATES = {
			SUBMODELS_FETCHED: {
				tipusMaterials: [{"id":"AGS","nom":"Notícia agència","tipus":"MATERIAL_TYPE"},{"id":"ARX","nom":"Arxiu","tipus":"MATERIAL_TYPE"},{"id":"BLO","nom":"Blocs","tipus":"MATERIAL_TYPE"},{"id":"CAR","nom":"Careta","tipus":"MATERIAL_TYPE"},{"id":"COM","nom":"Competició, Partit Sencer","tipus":"MATERIAL_TYPE"},{"id":"CRO","nom":"Crònica","tipus":"MATERIAL_TYPE"},{"id":"EDI","nom":"Editat","tipus":"MATERIAL_TYPE"},{"id":"ENV","nom":"Enviament tràfic","tipus":"MATERIAL_TYPE"},{"id":"GRA","nom":"Grafisme","tipus":"MATERIAL_TYPE"},{"id":"ORI","nom":"Original","tipus":"MATERIAL_TYPE"},{"id":"OTR","nom":"Original Transmissió","tipus":"MATERIAL_TYPE"},{"id":"PAR","nom":"Paral.lel d'Antena","tipus":"MATERIAL_TYPE"},{"id":"PPD","nom":"Preparat Per Difusió","tipus":"MATERIAL_TYPE"},{"id":"PPW","nom":"Preparat per web","tipus":"MATERIAL_TYPE"},{"id":"REC","nom":"Recurs","tipus":"MATERIAL_TYPE"},{"id":"TRB","nom":"Clip de treball","tipus":"MATERIAL_TYPE"},{"id":"TRC","nom":"Trailer","tipus":"MATERIAL_TYPE"},{"id":"VCL","nom":"Videoclip","tipus":"MATERIAL_TYPE"}],
                grups: [{"id":"1497","nom":"Enginyeria - QA1"},{"id":"1498","nom":"Enginyeria - QA2"},{"id":"1005","nom":"Esports"},{"id":"1001","nom":"Informatius"}],
                permis: '504',
                tipusMaterial: 'TRB',
                dataCaducitat: '2018-06-11',
                grup: '1497',
                perArxiu: false,
                online: true
			}
	};
	
	
	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/clip-creator', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Clip creator', function() {
			beforeEach(function(done) {
				this.view = ViewSetup.initialize(View);
				this.view.once('view.render', function() {
					done();
				});
			});
			describe('Render States', function() {
				it('should create the view', function() {
					expect(this.view.$el.hasClass('view-attached')).toBeTruthy();
				});
			});
			describe('Actions and Events', function() {
				it('should call to create clip creator when event received', function(done) {
					this.view.once('view.render', _.bind(function() {
						this.view.$('.restricted-click-area-view').trigger('submit');
						expect(this.view.viewModel.setTitol.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setTipusMaterial.calledOnce).toBeTruthy();	
						expect(this.view.viewModel.setTipusMaterial.calledWith('TRB')).toBeTruthy();
						expect(this.view.viewModel.setPermisos.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setPermisos.calledWith('Grup')).toBeTruthy();
						expect(this.view.viewModel.setGrup.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setGrup.calledWith('1497')).toBeTruthy();
						expect(this.view.viewModel.setDataCaducitat.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setDataCaducitat.calledWith('2018-06-11')).toBeTruthy();
						expect(this.view.viewModel.setTallarClip.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setTallarClip.calledWith(false)).toBeTruthy()
						expect(this.view.viewModel.setPerArxiu.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setPerArxiu.calledWith(false)).toBeTruthy();
						expect(this.view.viewModel.setToOnline.calledOnce).toBeTruthy();
						expect(this.view.viewModel.setToOnline.calledWith(true)).toBeTruthy();
						expect(this.view.viewModel.createClip.calledOnce).toBeTruthy();
						done();
					}, this));

					this.view.viewModel.set(VIEW_MODEL_STATES.SUBMODELS_FETCHED);
					this.view.render();
				});

			});
		});
	});
});