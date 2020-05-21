require(['./model/generic-modal'], function (GenericModalModel) {
    describe("Generic Modal", function () {

        var genericModalModel,
            titol = 'titol',
            missatge = 'missatge',
            className = 'className';

        describe("Basic usage", function () {
            beforeEach(function () {
                genericModalModel = new GenericModalModel();
                genericModalModel.show(titol, missatge);
            });

            it("should be visible when show", function (done) {
                expect(genericModalModel.get('show')).toBeTruthy();
                expect(genericModalModel.get('title')).toEqual(titol);
                expect(genericModalModel.get('message')).toEqual(missatge);
                done();
            });


            it("should be hide when resetModal", function (done) {
                genericModalModel.once('change', function () {
                    expect(genericModalModel.get('show')).toBeFalsy();
                    expect(genericModalModel.get('title')).toBeFalsy();
                    expect(genericModalModel.get('message')).toBeFalsy();
                    done();
                });
                genericModalModel.resetModal();
            });
        });

        describe("Advanced usage", function () {
            beforeEach(function () {
                genericModalModel = new GenericModalModel();
                genericModalModel.show({
                    title: titol,
                    message: missatge,
                    className: className
                });
            });

            it("should be visible when show", function (done) {
                expect(genericModalModel.get('show')).toBeTruthy();
                expect(genericModalModel.get('title')).toEqual(titol);
                expect(genericModalModel.get('message')).toEqual(missatge);
                expect(genericModalModel.get('className')).toEqual(className);
                done();
            });


            it("should be hide when resetModal", function (done) {
                genericModalModel.once('change', function () {
                    expect(genericModalModel.get('show')).toBeFalsy();
                    expect(genericModalModel.get('title')).toBeFalsy();
                    expect(genericModalModel.get('message')).toBeFalsy();
                    expect(genericModalModel.get('className')).toBeFalsy();
                    done();
                });
                genericModalModel.resetModal();
            });
        });


    });
});