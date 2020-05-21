require([], function() {
	/*
	 * -----------------------------------------------
	 * Configuració bàsica
	 * -----------------------------------------------
	 */
	var injector = new Squire();

	/*
	 * -----------------------------------------------
	 * ViewModel States
	 * -----------------------------------------------
	 */
	 var VIEW_MODEL_SEARCH_BOX = {
			 materialType: [{id: "AGS", nom: "Notícia agència", tipus: "MATERIAL_TYPE", selected: true},
			               {id: "ARX", nom: "Arxiu", tipus: "MATERIAL_TYPE", selected: false}
			               ],
			 isVisible: true,
			 open: true
	 }
	/*
	 * -----------------------------------------------
	 * Mock ViewModel
	 * -----------------------------------------------
	 */
	var ViewModel = Backbone.Model.extend({
		selectMaterial: jasmine.createSpy('selectMaterial')
	});
	injector.mock('./view-model/search-box', ViewModel);

	/*
	 * -----------------------------------------------
	 * Importació i test de la vista
	 * -----------------------------------------------
	 */
	injector.require(['./view/search-box', 'test/javascript/common/view-setup'], function(View, ViewSetup) {
		describe('Views: Search box', function() {
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
				it('should has selected when material is selected', function(done) {
					this.view.once('view.render', _.bind(function() {
						expect(this.view.$el.find('option')[0].selected).toBe(true);
						done();
					}, this));

                    this.view.viewModel.set(VIEW_MODEL_SEARCH_BOX);
					this.view.render();
				});

			});
		});
	});
});