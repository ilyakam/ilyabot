describe('commitFactory', function() {
  var factory;

  beforeEach(function() {
    factory = require('./commit-factory.js');
  });

  describe('#validateMessage()', function() {
    describe('when the commit message follows the guidelines', function() {
      it('should be valid', function() {
        var message = [
          'test(commit): a single line',
          '',
          'Reason behind having this commit'
        ].join('\n');

        expect(factory.validateMessage(message))
          .toBe(true);
      });
    });

    describe('when commit message is too short', function() {
      it('should not be valid with just a title', function() {
        var message = 'test(commit): add a subject line';

        expect(factory.validateMessage(message))
          .toBe(false);
      });

      it('should not be valid without a body', function() {
        var message = [
          'test(commit): a single line',
          ''
        ].join('\n');

        expect(factory.validateMessage(message))
          .toBe(false);
      });
    });

    describe('when the commit title is malformed', function() {
      var messageLines;

      beforeEach(function() {
        messageLines = [
          '',
          'A valid subject',
          '',
          'FOOTER-123'
        ];
      });

      it('should not be valid without a type', function() {
        messageLines.unshift('(test): a single line');

        expect(factory.validateMessage(messageLines.join('\n')))
          .toBe(false);
      });

      it('should not be valid without a proper type', function() {
        messageLines.unshift('fail(test): a single line');

        expect(factory.validateMessage(messageLines.join('\n')))
          .toBe(false);
      });

      it('should not be valid without a scope', function() {
        messageLines.unshift('feat(): a single line');

        expect(factory.validateMessage(messageLines.join('\n')))
          .toBe(false);
      });

      it('should not be valid without a title', function() {
        messageLines.unshift('feat(*):');

        expect(factory.validateMessage(messageLines.join('\n')))
          .toBe(false);
      });
    });

    describe('when the commit message is missing a line break', function() {
      it('should not be valid', function() {
        var message = [
          'test(commit): a single line',
          'THIS LINE SHOULD BE BLANK',
          'Reason behind having this commit'
        ].join('\n');

        expect(factory.validateMessage(message))
          .toBe(false);
      });
    });

    describe('when the commit message body is too long', function() {
      it('should not be valid', function() {
        var message = [
          'test(commit): a single line',
          '',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
        ].join('\n');

        message += ' sed do eiusmod tempor incididunt ut labore.';

        expect(factory.validateMessage(message))
          .toBe(false);
      });
    });
  });
});
