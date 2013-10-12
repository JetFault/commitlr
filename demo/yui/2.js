YUI().add('commitlr-controller', function (Y) {
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

                    cb(response);

                },
                failure : function(transactionID, response) {
                    cb("Failed with status: " + response.status + 
                                " - " + response.responseText);
                }
            }
        });
    }

    var ns = Y.namespace("Commitlr");
    ns.getCommits = getCommits;
}, '1.0.0', {
         requires: ['commitlr-commit', 'escape', 'array-extras']
});
