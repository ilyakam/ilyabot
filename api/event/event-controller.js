// TESTME:
var commitFactory = require('./../../commit/commit-factory.js'), // « FIXME
    request = require('request');

function processCommitMessage(url) {
  var options = {
    headers: {'User-Agent': 'ilyabot'}, // « TODO: set global headers
    method: 'GET',
    url: url
  };

  request(options, function(error, response, body) {
    // TODO: Handle error

    var data = JSON.parse(body);

    commitFactory.validateMessage(data.commit.message);
  });
}

// ANNOTATEME:
function setStatus(url, state, description) {
  // NOTE: `state` is an enum of `pending`, `success`, `error`, or `failure`
  // TODO: validate state
  var options = {
    method: 'POST',
    url: url,

    headers: {
      'Authorization': 'token [DUMBASS]', // TODO: register a proper env variable
      'Content-Type': 'application/json',
      'User-Agent': 'ilyabot'
    },

    json: {
      context: 'ilyabot',
      state: state
    }
  };

  if (description) {
    options.json.description = description;
  }

  console.log('about to POST to', url);

  request(options, function(error, response, body) {
    // TODO: Handle error

    console.log('set status response is', body);
  });
}

exports.getEventHandler = function(req, res) {
  var commitUrl = req.body.repository.commits_url.replace(
        '{/sha}', '/' + req.body.pull_request.head.sha
      ),
      statusesUrl = req.body.pull_request.statuses_url;

  processCommitMessage(commitUrl);

  // Sets status to pending, see:
  // https://developer.github.com/v3/repos/statuses/
  setStatus(statusesUrl, 'pending');

  // TODO:
  // 1. Fetch last commit from:
  //    {req.body.repo}{req.body.pull_request.head.sha}
  // 1. Download PATCH from req.body.pull_request.patch_url
  // 2. Parse it to extract the commit message
  // 3. Validate it against commit guidelines
  // 4. Return response based on validation

  res.sendStatus(202);
};
