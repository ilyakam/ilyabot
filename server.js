var bodyParser = require('body-parser'),
    express = require('express'),
    log = require('log4js').getLogger(),
    morgan = require('morgan'),
    app,
    handleEvent,
    server;

require('dotenv').config();

handleEvent = require('./event/event-handler.js');

app = express();

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(function(req, res, next) {
  log.info('%s %s', req.method, req.url);

  next();
});

app.post('/event_handler', handleEvent);

app.use(function(req, res) {
  res.sendStatus(404);
});

app.set('port', process.env.PORT);

server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port %d', server.address().port);
});

module.exports = server;
