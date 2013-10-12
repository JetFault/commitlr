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

    Y.namespace("Commitlr");
});
