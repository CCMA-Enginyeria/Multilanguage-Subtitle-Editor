require([], function() {
	/*
	 * -----------------------------------------------
	 * Configuració bàsica
	 * -----------------------------------------------
	 */
	var injector = new Squire();
	var genericModalModel;
	/*
	 * -----------------------------------------------
	 * Mock ViewModel
	 * -----------------------------------------------
	 */
	var ViewModel = Backbone.Model.extend({
		logout: jasmine.createSpy('logout'),
		prepareURL: jasmine.createSpy('prepareURL')		
	});
	injector.mock('./view-model/header', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */
	
	var VIEW_MODEL_STATES = {
			NO_LOGIN: {
				login: null,
	            carpeta: null,
	            capacitat_color: null,
	            disponible: null,
	            hores50: null,
	            minuts50: null,
	            hores100: null,
	            minuts100: null,
	            gb: null
			},	
			
			WARNING_SPACE: {
				login: 'digi_tes',
	            carpeta: 1001,
	            capacitat_color: 'taronja',
	            disponible: 51,
	            hores50: 100,
	            minuts50: 10,
	            hores100: 101,
	            minuts100: 11,
	            gb: 2345
			}	

	}
    
	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/header', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Header', function() {
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
				
				it('should not show space state if not logged in', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.trigger-indicador').attr('title')).toBe("Disponible ingesta: % ( GB)\nh min (50Mbps)\nh min (100Mbps)");
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.NO_LOGIN);
				});
				
				it('should show space info on title attr and apply color class', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('.trigger-indicador').attr('title')).toBe("Disponible ingesta: 51% (2345 GB)\n100h 10min (50Mbps)\n101h 11min (100Mbps)");
						expect(this.view.$el.find('.trigger-indicador.taronja').length).toBe(1);
						done();
					}, this));
					this.view.viewModel.set(VIEW_MODEL_STATES.WARNING_SPACE);
				});
			});

			describe('Actions and Events', function() {
				it('should call logout when click logout', function() {
					this.view.$el.find('.logout').click();
					expect(this.view.viewModel.logout).toHaveBeenCalled();
				});
				/* Ja no hi ha botó d'arxiu
				it('should call search when click newie', function() {
					this.view.$el.find('#arx_link').click();
					expect(this.view.viewModel.prepareURL).toHaveBeenCalled();
				});
				*/
			});
		});
	});
});