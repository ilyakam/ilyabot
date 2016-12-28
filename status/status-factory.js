var request = require('request'),
    options;

options = {
  json: {context: 'ilyabot'},
  method: 'POST',

  headers: {
    'Authorization': 'token ' + process.env.GITHUB_ACCESS_TOKEN,
    'Content-Type': 'application/json',
    'User-Agent': 'ilyabot'
  }
};

/**
 * @name send
 * @description Sends the state and description to the GitHub statuses endpoint
 * @see {@link https://developer.github.com/v3/repos/statuses/}
 * @param {String} state The state of the status; choose from:
 *                       `pending`, `success`, `error`, or `failure`
 * @param {String} [description] A short description of the status
 */
function send(state, description) {
  // TODO: validate state
  // NOTE: `state` is an enum of `pending`, `success`, `error`, or `failure`

  options.json.state = state;

  if (description) {
    options.json.description = description;
  }

  // TODO: Handle error in callback - (options, function(error, response, body))
  request(options);
}

/**
 * @name setUrl
 * @description Sets the `statuses` API URL onto the private `options` object
 * @param {String} url Statuses API URL
 */
function setUrl(url) {
  // TODO: validate _.isString and throw error

  options.url = url;
}

module.exports = {
  send: send,
  setUrl: setUrl
};
