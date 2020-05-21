require([], function() {
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
		createClip: jasmine.createSpy('createClip'),
		search: jasmine.createSpy('search'),
		selectedOptionsText: jasmine.createSpy('selectedOptionsText'),
		selectedTipusId: jasmine.createSpy('selectedTipusId'),
		setText: jasmine.createSpy('setText')
	});
	injector.mock('./view-model/estrats-toolbar', ViewModel);

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/estrats-toolbar', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Estrat Toolbar', function() {
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
				it('should call sendToCartClip when click crear clip', function() {
					this.view.$el.find('.send-clip-to-cart-action').click();
					expect(this.view.viewModel.createClip).toHaveBeenCalled();
				});
				it('should call search when click search estrat', function() {
					this.view.$el.find('.search-action').submit();
					expect(this.view.viewModel.search).toHaveBeenCalled();
				});
			});
		});
	});
});