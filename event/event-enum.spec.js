describe('eventEnum', function() {
  var eventEnumKeys;

  beforeEach(function() {
    eventEnumKeys = Object.keys(require('./event-enum.js'));
  });

  it('should contain TYPE', function() {
    expect(eventEnumKeys)
      .toContain('TYPE');
  });
});
