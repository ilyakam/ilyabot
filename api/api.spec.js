var api = require('./api.js');

describe('API Handlers', function() {
  var app;

  beforeEach(function() {
    app = {use: jasmine.createSpy('app.use')};

    api(app);
  });

  it('should handle /event_handler', function() {
    expect(app.use)
      .toHaveBeenCalledWith('/event_handler', jasmine.any(Function));
  });
});
