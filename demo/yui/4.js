YUI().add('commitlr-controller', function (Y) {

    //getVal returns the value of an object, undefined if not found
    var getVal = function() { 
        try {
            return Y.Object.getValue.apply(this, arguments);
        } catch(e) {
            return undefined;
        }
    };


    //Get a list of tumblr items relating to keyword
    function getTumblrFromTag(keyword, cb) {
        var TUMBLR_TAG_URL = 'http://api.tumblr.com/v2/tagged?tag={tag}&api_key={api_key}';
        var tagURL = Y.Lang.sub(TUMBLR_TAG_URL, {tag: keyword, api_key: TUMBLR_API_KEY});

        Y.YQL('select * from json where url="' + tagURL + '"', function(result) {

            result = result.query.results.json;

            var tumblrImages;

            var tumblogs = result.response;

            tumblrImages = Y.Array.map(tumblrImages, function(tumblog) {
                return getVal(tumblog.photos, ['original_size', 'url']);
            });

            cb(null, tumblrImages);
        });

    }

    var ns = Y.namespace("Commitlr");
    ns.getTumblrFromTag = getTumblrFromTag;

}, '1.0.0', {
         requires: ['commitlr-commit', 'escape', 'array-extras']
});
