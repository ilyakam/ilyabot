/**
 * @private
 * @name isAngularJsCommitMessage
 * @description Validates the commit message against the AngularJS commit
 *              message guidelines.
 * @see {@link https://github.com/angular/angular.js/blob/
 *             master/CONTRIBUTING.md#-git-commit-guidelines}
 * @param {String} message Commit message
 * @returns {Boolean} Whether it follows the AngularJS commit message guidelines
 */
function isAngularJsCommitMessage(message) {
  var lines = message.split('\n');

  if (!validateMinimumLength(lines.length)) {
    return false;
  }

  if (!validateTitle(lines[0])) {
    return false;
  }

  if (!validateBlankLine(lines[1])) {
    return false;
  }

  if (!validateBodyLength(lines.splice(2))) {
    return false;
  }

  return true;
}

/**
 * @private
 * @name validateBlankLine
 * @description Ensures that there is a blank line
 * @param {String} line Commit message line
 * @returns {Boolean} Whether or not there is a blank line
 */
function validateBlankLine(line) {
  return line === '';
}

/**
 * @private
 * @name validateBodyLength
 * @description Ensures that each line in the commit message body is shorter
 *              than 72 characters
 * @param {Array} lines Commit message body represented as an array of strings
 * @returns {Boolean} Whether or not at least one line is too long
 */
function validateBodyLength(lines) {
  var characterLimit = 72;

  return lines.every(function(line) {
    return line.length <= characterLimit;
  });
}

/**
 * @name validateMessage
 * @description Validates the commit message against a given guideline
 * @param {String} message Commit message
 * @returns {Boolean} Whether or not the commit message is valid
 */
function validateMessage(message) {
  return isAngularJsCommitMessage(message);
}

/**
 * @private
 * @name validateMinimumLength
 * @description Ensures that the commit message is least three lines long
 * @param {Number} numberOfLines Number of lines in the commit message
 * @returns {Boolean} Whether or not it has a minimum number of lines
 */
function validateMinimumLength(numberOfLines) {
  var minimumLines = 3;

  return numberOfLines >= minimumLines;
}

/**
 * @private
 * @name validateTitle
 * @description Ensures that the title is valid by checking that it contains
 *              `type`, `scope`, and `subject`
 * @param {String} title Commit message title
 * @returns {Boolean} Whether or not the title is valid
 */
function validateTitle(title) {
  var isValidTitle = true,
      matches = title.match(/^(\w+)\((\w+)\)\:\s(.*)$/),
      type;

  if (!matches || matches.length < 4) {
    return false;
  }

  type = matches[1];

  isValidTitle = validateType(type);

  return isValidTitle;
}

/**
 * @private
 * @name validTypes
 * @description Ensures that the type is from a list of valid types
 * @param {String} type Commit message title type
 * @returns {Boolean} Whether or not the type is from a list of valid types
 */
function validateType(type) {
  var validTypes = [
    'chore',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'style',
    'test'
  ];

  return validTypes.indexOf(type) >= 0;
}

module.exports = {
  validateMessage: validateMessage
};
