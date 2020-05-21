define([
    './editor',
    './editorFullCircuit',
    './reviewer',
    './editorRejected',
],function(){
    var result = [];
    _.each(arguments, function(testArray) {
        result = result.concat(testArray);
    });
    return result;
})