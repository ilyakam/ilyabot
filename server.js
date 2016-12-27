var api = require('./api/api.js'),
    bodyParser = require('body-parser'),
    express = require('express'),
    log = require('log4js').getLogger(),
    nconf = require('nconf'),
    app,
    server;

nconf
  .argv()
  .env()
  .file({file: './config.json'})
  .defaults({PORT: 3000});

app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  log.info('%s %s', req.method, req.url);

  next();
});

api(app);

app.use(function(req, res) {
  res.sendStatus(404);
});

app.set('port', nconf.get('PORT'));

server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port %d', server.address().port);
});

module.exports = server;
