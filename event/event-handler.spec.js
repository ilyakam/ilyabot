var bodyParser = require('body-parser'),
    express = require('express'),
    mockery = require('mockery'),
    request = require('supertest');

describe('eventHandler', function() {
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

  describe('#handleEvent()', function() {
    var app,
        mockCommitFactory,
        mockStatusFactory,
        spyOnCommitFactoryValidateMessage,
        spyOnMockRequest,
        spyOnStatusFactorySend,
        spyOnStatusFactorySetUrl;

    beforeEach(function() {
      app = express();

      app.use(bodyParser.json());

      spyOnCommitFactoryValidateMessage = jasmine.createSpy('commitFactory.validateMessage');
      spyOnStatusFactorySend = jasmine.createSpy('statusFactory.send');
      spyOnStatusFactorySetUrl = jasmine.createSpy('statusFactory.setUrl');

      spyOnMockRequest = jasmine.createSpy('request')
        .and.callFake(function(options, callback) {
          var body = JSON.stringify({commit: {message: 'test commit message'}});

          callback(null, null, body);
        });

      mockCommitFactory = {validateMessage: spyOnCommitFactoryValidateMessage};

      mockStatusFactory = {
        send: spyOnStatusFactorySend,
        setUrl: spyOnStatusFactorySetUrl
      };

      mockery.registerMock('./../commit/commit-factory.js', mockCommitFactory);
      mockery.registerMock('./../status/status-factory.js', mockStatusFactory);
      mockery.registerMock('request', spyOnMockRequest);

      app.use(require('./event-handler.js'));
    });

    afterEach(function() {
      mockery.deregisterMock('./../commit/commit-factory.js');
      mockery.deregisterMock('./../status/status-factory.js');
      mockery.deregisterMock('request');
    });

    describe('when the event is a pull request', function() {
      var call;

      beforeEach(function() {
        var data = {
          repository: {commits_url: 'http://example.com{/sha}'},
          pull_request: {
            head: {sha: 'abc123'},
            statuses_url: 'http://example.com/statuses_url'
          }
        };

        call = request(app)
          .post('/event_handler')
          .set('x-github-event', 'pull_request')
          .send(data);
      });

      it('should set the URL on the status factory', function(done) {
        call
          .end(function(err) {
            if (err) {
              return done(err);
            }

            expect(mockStatusFactory.setUrl)
              .toHaveBeenCalledWith('http://example.com/statuses_url');

            return done();
          });
      });

      it('should set a "pending" status', function(done) {
        call
          .end(function(err) {
            if (err) {
              return done(err);
            }

            expect(mockStatusFactory.send)
              .toHaveBeenCalledWith('pending');

            return done();
          });
      });

      it('should fetch the commit message', function(done) {
        call
          .end(function(err) {
            if (err) {
              return done(err);
            }

            expect(spyOnMockRequest)
              .toHaveBeenCalledWith(
                jasmine.objectContaining({url: 'http://example.com/abc123'}),
                jasmine.anything()
              );

            return done();
          });
      });

      it('should validate the commit message', function(done) {
        call
          .end(function(err) {
            if (err) {
              return done(err);
            }

            expect(spyOnCommitFactoryValidateMessage)
              .toHaveBeenCalledWith('test commit message');

            return done();
          });
      });

      describe('when the commit message is valid', function() {
        beforeEach(function() {
          spyOnCommitFactoryValidateMessage
            .and.returnValue(true);
        });

        it('should send a successful status', function(done) {
          call
            .end(function(err) {
              if (err) {
                return done(err);
              }

              expect(spyOnStatusFactorySend)
                .toHaveBeenCalledWith('success');

              return done();
            });
        });
      });

      describe('when the commit message is not valid', function() {
        beforeEach(function() {
          spyOnCommitFactoryValidateMessage
            .and.returnValue(false);
        });

        it('should send an erroneous status with a description', function(done) {
          call
            .end(function(err) {
              if (err) {
                return done(err);
              }

              expect(spyOnStatusFactorySend)
                .toHaveBeenCalledWith('error', jasmine.any(String));

              return done();
            });
        });
      });
    });

    describe('when the event is not a pull request', function() {
      var call;

      beforeEach(function() {
        call = request(app)
          .post('/event_handler')
          .set('x-github-event', 'something-else');
      });

      it('should not send a status update', function(done) {
        call
          .end(function(err) {
            if (err) {
              return done(err);
            }

            expect(mockStatusFactory.send)
              .not.toHaveBeenCalled();

            return done();
          });
      });

      it('should respond with status 202 Accepted', function(done) {
        call
          .end(function(err, res) {
            if (err) {
              return done(err);
            }

            expect(res.status)
              .toEqual(202);

            return done();
          });
      });
    });
  });
});
