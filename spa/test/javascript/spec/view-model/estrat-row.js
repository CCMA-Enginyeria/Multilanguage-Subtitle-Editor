require(['./view-model/estrat-row', '../../../../test/javascript/common/model-templates'], function(EstratRowViewModel, ModelTemplates) {
    describe("Estrat row View Model", function() {

    	var estratRow;
    	var options;

    	beforeEach(function() {
    		ModelTemplates.inicializeMeModel();
        });

        afterEach(function() {

        });

        describe("inicialize view-model with diferent actions", function() {
	        it("should has keyframe informate", function () {
	        	options = {"model":{"keyframe": "keyframe1.jpg"}, "clipboard": {}};
	        	estratRow = new EstratRowViewModel(null, options);

	    		var data = estratRow.toJSON();

	         	expect(data.keyframe).toBe('keyframe1.jpg');
	        });
        });

    });
});