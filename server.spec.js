var mockery = require('mockery'),
    request = require('supertest');

describe('Server Runtime', function() {
  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
  });

  afterEach(function() {
    mockery.disable();

    mockery.deregisterAll();
  });

  describe('log', function() {
    var mockLog4js,
        server,
        spyOnLogInfo;

    beforeEach(function() {
      spyOnLogInfo = jasmine.createSpy('log.info');

      mockLog4js = {
        getLogger: function() {
          return {info: spyOnLogInfo};
        }
      };

      mockery.registerMock('log4js', mockLog4js);

      server = require('./server.js');
    });

    afterEach(function() {
      mockery.deregisterMock('log4js');

      server.close();
    });

    it('should indicate that the server is running', function(done) {
      request(server)
        .get('/test')
        .end(function() {
          expect(spyOnLogInfo.calls.first().args[0])
            .toEqual(jasmine.stringMatching('Express server listening'));

          return done();
        });
    });

    it('should contain API call method', function(done) {
      request(server)
        .get('/test')
        .end(function() {
          expect(spyOnLogInfo.calls.mostRecent().args[1])
            .toEqual('GET');

          return done();
        });
    });

    it('should contain API call URL', function(done) {
      request(server)
        .get('/test')
        .end(function() {
          expect(spyOnLogInfo.calls.mostRecent().args[2])
            .toEqual('/test');

          return done();
        });
    });
  });

  describe('not found', function() {
    var server;

    beforeEach(function() {
      server = require('./server.js');
    });

    afterEach(function() {
      server.close();
    });

    it('should return message Not Found', function(done) {
      request(server)
        .get('/nope')
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          expect(res.text)
            .toEqual('Not Found');

          return done();
        });
    });
  });

  describe('POST /event_handler', function() {
    var server,
        spyOnMockHandleEvent;

    beforeEach(function() {
      spyOnMockHandleEvent = jasmine.createSpy('handleEvent')
        .and.callFake(function(req, res) {
          res.sendStatus(200);
        });

      mockery.registerMock('./event/event-handler.js', spyOnMockHandleEvent);

      server = require('./server.js');
    });

    afterEach(function() {
      mockery.deregisterMock('./event/event-handler.js');

      server.close();
    });

    it('should handle the event', function(done) {
      request(server)
        .post('/event_handler')
        .end(function(err) {
          if (err) {
            return done(err);
          }

          expect(spyOnMockHandleEvent)
            .toHaveBeenCalled();

          return done();
        });
    });
  });
});
