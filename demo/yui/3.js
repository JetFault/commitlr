YUI().add('commitlr-controller', function (Y) {

    //getVal returns the value of an object, undefined if not found
    var getVal = function() { 
        try {
            return Y.Object.getValue.apply(this, arguments);
        } catch(e) {
            return undefined;
        }
    };

    //Get the Content Analysis of a message
    //cb:
    //  ["dog buys cat", "alphabet soup", "hackru"]
    function getSummary(message, cb) {
        message = Y.Escape.html(message);
        Y.YQL('select * from contentanalysis.analyze where ' +
              'text="' + message + '"', function(result) {

            var keywords = [];

            var entities = getVal(result, ['entities', 'entity']);

            cb(null, keywords);
        });
    }

    var ns = Y.namespace("Commitlr");
    ns.getSummary = getSummary;

}, '1.0.0', {
         requires: ['commitlr-commit', 'escape', 'array-extras']
});
