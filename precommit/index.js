
/*
 * POST for payload from commit for post-receive hook
 */

exports.receive = function(req, res) {
    var payload,
        commits;

    try { 
        payload = JSON.parse(req.param('payload'));
    } catch (e) {
        console.log('Error Parsing post_receive payload: ' + e);
    }

    commits = payload.commits;

};
