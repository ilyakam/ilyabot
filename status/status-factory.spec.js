var mockery = require('mockery');

describe('statusFactory', function() {
  var factory,
      spyOnMockRequest;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    spyOnMockRequest = jasmine.createSpy('request');

    mockery.registerMock('request', spyOnMockRequest);

    factory = require('./status-factory.js');
  });

  afterEach(function() {
    mockery.deregisterMock('request');

    mockery.disable();

    mockery.deregisterAll();
  });

  describe('#send()', function() {
    describe('#setUrl()', function() {
      it('should set options.url', function() {
        factory.setUrl('https://example.com');

        factory.send();

        expect(spyOnMockRequest)
          .toHaveBeenCalledWith(
            jasmine.objectContaining({url: 'https://example.com'})
          );
      });
    });

    it('should set options.json.state', function() {
      factory.send('pending');

      expect(spyOnMockRequest)
        .toHaveBeenCalledWith(
          jasmine.objectContaining({
            json: jasmine.objectContaining({state: 'pending'})
          })
        );
    });

    it('should set options.json.description', function() {
      factory.send('pending', 'Unit test');

      expect(spyOnMockRequest)
        .toHaveBeenCalledWith(
          jasmine.objectContaining({
            json: jasmine.objectContaining({description: 'Unit test'})
          })
        );
    });
  });
});
