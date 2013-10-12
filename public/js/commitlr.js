/**
 * Set up a local YUI instance.
 * Load local copies of:
 *      node:       DOM Manipulation
 *      io:         AJAX calls
 *      yql:        Yahoo Query Language
 *      json-parse: Parse JSON (use `json` if you want stringify also
 *      controller: Our Commitlr controllers
 */
YUI().use('node', 'io', 'yql', 'json-parse', 'array-extras', 'handlebars',
          'commitlr-controller', function(Y) {

    var commitlr = Y.Commitlr,
        content = Y.one('.content');

    commitlr.getCommits("JetFault", "commitlr", function(error, commits) {
        if(error) {
            console.log(error);
        } else {
            console.log(commits);

            var commitBoxTemplate = Y.Handlebars.compile(
                    Y.one('#template-commitbox').getHTML());

            Y.each(commits, function(commit) {
                commitlr.getSummary(commit.message, function(error, keywords) {
                    commitlr.getTumblrFromTag(keywords[0], function(error, images) { 
                        console.log("Images");
                        console.log(images);
                        content.append(commitBoxTemplate({
                            commit: commit,
                            keywords: keywords,
                            image: images[0]
                        }));
                    });
                });
            });
        }
    });

    Y.namespace("Commitlr");
});
