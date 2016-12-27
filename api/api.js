/**
 * @name api
 * @description Points routes to their respective handlers
 * @param {Function} app Express application set up for routing
 */
function api(app) {
  app.use('/event_handler', require('./event/event-handler.js'));
}

module.exports = api;
