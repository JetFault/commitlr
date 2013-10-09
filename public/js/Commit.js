YUI.add('commitlr-commit', function (Y) {    

    function Commit(config) {
        var self = {};

        self.sha = config.sha;
        self.message = config.message;
        self.commitURL_api = config.commitURL_api;
        self.commitURL_html = config.commitURL_html;

        self.committer = new Y.Commitlr.Committer({
            name            : config.committer.name,
            email           : config.committer.email,
            username        : config.committer.username,
            profilePic      : config.committer.profilePic,
            userURL_html    : config.committer.userURL_html,
            userURL_api     : config.committer.userURL_api
        });

        return self;
    }

    Y.namespace("Commitlr").Commit = Commit;
}, '1.0.0', {
    requires: ['commitlr-committer']
});
