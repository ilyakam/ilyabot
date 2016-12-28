var commitFactory = require('./../commit/commit-factory.js'),
    eventEnum = require('./event-enum.js'),
    request = require('request'),
    statusFactory = require('./../status/status-factory.js');

/**
 * @name handleEvent
 * @description Handles the API endpoint `POST /event_handler`
 *              Regardless of outcome, responds with 202 Accepted
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
function handleEvent(req, res) {
  var eventType = req.headers['x-github-event'];

  if (eventType === eventEnum.TYPE.PULL_REQUEST.value) {
    handlePullRequest(req.body);
  }

  res.sendStatus(202);
}

/**
 * @private
 * @name handlePullRequest
 * @description Handles a Pull Request event by processing its commit message
 * @param {Object} body Event payload including `repository` and `pull_request`
 * @see {@link https://developer.github.com/v3/activity/
 *             events/types/#pullrequestevent}
 */
function handlePullRequest(body) {
  var commitUrl = body.repository.commits_url.replace(
    '{/sha}', '/' + body.pull_request.head.sha
  );

  statusFactory.setUrl(body.pull_request.statuses_url);

  statusFactory.send('pending');

  processCommitMessage(commitUrl);
}

/**
 * @private
 * @name processCommitMessage
 * @description Fetches commit message and validates it
 *              Sends a status response depending on the validation
 * @param {String} commitUrl URL to fetch the commit from
 */
function processCommitMessage(commitUrl) {
  var options = {
    headers: {'User-Agent': 'ilyabot'}, // « TODO: set global headers
    method: 'GET',
    url: commitUrl
  };

  request(options, function(error, response, body) {
    // TODO: Handle error
    var data = JSON.parse(body);

    if (commitFactory.validateMessage(data.commit.message)) {
      statusFactory.send('success');
    } else {
      statusFactory.send('error', 'Commit message does not follow guidelines');
    }
  });
}

module.exports = handleEvent;
