var mockery = require('mockery');

describe('Event Handler', function() {
  var mockController,
      mockExpress,
      spyOnExpressRouterPost;

  beforeEach(function() {
    spyOnExpressRouterPost = jasmine.createSpy('express.Router.post');

    mockController = {getEventHandler: 'controller.getEventHandler'};

    mockExpress = {
      Router: function() {
        return {post: spyOnExpressRouterPost};
      }
    };

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerMock('./event-controller.js', mockController);
    mockery.registerMock('express', mockExpress);

    require('./event-handler.js');
  });

  afterEach(function() {
    mockery.disable();

    mockery.deregisterAll();
  });

  it('should handle /', function() {
    expect(spyOnExpressRouterPost)
      .toHaveBeenCalledWith('/', 'controller.getEventHandler');
  });
});
