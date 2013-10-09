/**
 * Set up a local YUI instance.
 * Load local copies of:
 *      node:       DOM Manipulation
 *      io:         AJAX calls
 *      yql:        Yahoo Query Language
 *      json-parse: Parse JSON (use `json` if you want stringify also
 *      commit:     Our own Commit object
 */
YUI().use('node', 'io', 'yql', 'json-parse', 'commitlr-commit', function(Y) {

    var GITHUB_COMMITS_URL = 'https://api.github.com/repos/{user}/{repo}/commits';

    //getValue returns the value of an object, undefined if not found
    var getVal = Y.Object.getValue;

    /* All the callbacks have an `error` as first parameter */

    //Get the commits for the repo
    //cb: (error, commits)
    //  commits: Array of Commit {Objects}
    function getCommits(user, repo, cb) {
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
                    }
                    
                    var commits = [];

                    //For each commit
                    Y.each(response, function(ghCommit, index) {
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
                        commits.push(commit);
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
        Y.YQL('select * from ' + commitsURL, function(commits) {

        });

    }

    //Get a list of tumblr items relating to keyword
    //cb:
    //  [{
    //      url:    "http://tumblr.com/JetFault/abc"
    //  }]
    function getTumblrFromTag(keyword, cb) {

    }

    getCommits("JetFault", "commitlr", function(error, commits) {
        if(error) {
            console.log(error);
        } else {
            console.log(commits);
        }
    });

    Y.namespace("Commitlr");
});
