YUI.add('commitlr-committer', function (Y) {

    function Committer(config) {
        var self = {};

        self.name = config.name;
        self.email = config.email;
        self.username = config.username;
        self.profilePic = config.profilePic;
        self.userURL_html = config.userURL_html;
        self.userURL_api = config.userURL_api;

        return self;
    }

    Y.namespace("Commitlr").Committer = Committer;
}, '1.0.0', {
    requires: []
});
