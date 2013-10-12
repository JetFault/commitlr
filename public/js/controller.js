YUI().add('commitlr-controller', function (Y) {

    var TUMBLR_API_KEY = '4wzlrm0stkMcuXZhGDNI4qhknUYZK6uROBU3o3nLb9AxzPtNLA';


    //getVal returns the value of an object, undefined if not found
    var getVal = function() { 
        try {
            return Y.Object.getValue.apply(this, arguments);
        } catch(e) {
            return undefined;
        }
    };

    /* All the callbacks have an `error` as first parameter */

    //Get the commits for the repo
    //cb: (error, commits)
    //  commits: Array of Commit {Objects}
    function getCommits(user, repo, cb) {
        var GITHUB_COMMITS_URL = 'https://api.github.com/repos/{user}/{repo}/commits';
        //`sprintf` in javascript
        var commitsURL = Y.Lang.sub(GITHUB_COMMITS_URL, {user: user, repo: repo});

        Y.io(commitsURL, {
            method: 'GET',
            //Set up headers to do a CORS call
            //headers: { "Origin" : "http://commitlr.com" },
            on : {
                success : function(transactionID, response) {
                    //Parse the JSON
                    try {
                        //response is the XHR Response, response.response is the data
                        response = Y.JSON.parse(response.response);
                    } catch (e) {
                        cb("Failed parsing JSON for commits");
                        return;
                    }
                    
                    //Create our own objects with the commits
                    var commits = Y.Array.map(response, function(ghCommit) {
                        //Create a new Commit object
                        //We use Y.Array.getValue to easily go down the tree of the
                        //  object without checking if the parent exists. 
                        var commit = new Y.Commitlr.Commit({
                            sha : getVal(ghCommit, "sha"),
                            message : getVal(ghCommit, ["commit", "message"]),
                            commitURL_api : getVal(ghCommit, "url"),
                            commitURL_html : getVal(ghCommit, "html_url"),
                            committer : {
                                name : getVal(ghCommit, ["commit", "committer", "name"]),
                                email : getVal(ghCommit, ["commit", "committer", "email"]),
                                username : getVal(ghCommit, ["committer", "login"]),
                                profilePic : getVal(ghCommit, ["committer", "avatar_url"]),
                                userURL_api : getVal(ghCommit, ["committer", "url"]),
                                userURL_html : getVal(ghCommit, ["committer", "html_url"])
                            }
                        });

                        console.log(commit);
                        return commit;
                    });

                    //Remember, our design says first parameter is error
                    //You don't need to follow this, this is just the way Node does it.
                    cb(null, commits);

                },
                failure : function(transactionID, response) {
                    cb("Failed with status: " + response.status + 
                                " - " + response.responseText);

                }
            }
        });
    }

    //Get the Content Analysis of a message
    //cb:
    //  ["dog buys cat", "alphabet soup", "hackru"]
    function getSummary(message, cb) {
        message = Y.Escape.html(message);
        Y.YQL('select * from contentanalysis.analyze where ' +
              'text="' + message + '"', function(result) {

            console.log(result);

            var keywords = [];

            var entities = getVal(result, ['entities', 'entity']);

            //Didn't get a result, use longest word as keyword
            if(result.error || !entities || entities.length< 1) {
                var longestWord = function(str){
                       return (str.match(/\w[a-z]{0,}/gi) || [''])
                                  .reduce( function(a,b){return a.length>b.length ? a : b;} );
                };
                keywords = longestWord(message);
            } else {
                keywords = Y.Array.map(entities, function(entity) {
                   return entity.content;
                });
            }

            cb(null, keywords);
        });
    }

    //Get a list of tumblr items relating to keyword
    //cb:
    //  [{
    //      url:    "http://tumblr.com/JetFault/abc"
    //  }]
    function getTumblrFromTag(keyword, cb) {
        var TUMBLR_TAG_URL = 'http://api.tumblr.com/v2/tagged?tag={tag}&api_key={api_key}';
        var tagURL = Y.Lang.sub(TUMBLR_TAG_URL, {tag: keyword, api_key: TUMBLR_API_KEY});
        //tagURL = Y.Escape.html(tagURL);
        Y.YQL('select * from json where url="' + tagURL + '"', function(result) {
            result = result.query.results.json;
            console.log(result);

            var tumblrImages = [];

            var tumblogs = result.response;

            //Didn't get a result, use longest word as keyword
            if(result.meta.status != 200 || !tumblogs || tumblogs.length < 1) {
                tumblrImages = [''];
            } else {
                tumblrImages = Y.Array.map(tumblogs, function(tumblog) {
                    if (tumblog.type == 'photo') {
                        var img = getVal(tumblog.photos, ['original_size', 'url']);
                        if(img) return img;
                    }
                });
            }

            cb(null, tumblrImages);
        });

    }

    var ns = Y.namespace("Commitlr");
    ns.getCommits = getCommits;
    ns.getSummary = getSummary;
    ns.getTumblrFromTag = getTumblrFromTag;

}, '1.0.0', {
         requires: ['commitlr-commit', 'escape']
});
