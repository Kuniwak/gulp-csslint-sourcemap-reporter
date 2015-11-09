var assert = require('assert');
var sourcemapReporterImpl = require('../index').impl;
var sinon = require('sinon');

describe('gulp-csslint-sourcemap-reporter', function() {
  it('should print the only summary when no violations', function() {
    var violations = [];
    var file = createDummyFile(violations);
    var loggerDi = sinon.mock();

    sourcemapReporterImpl(file, loggerDi);

    assert(loggerDi.calledOnce);
    assertSummary(loggerDi);
  });


  it('should print the summary and a violation when the violation found', function() {
    var violations = [
      createViolation('VIOLATION_0'),
    ];
    var file = createDummyFile(violations);
    var loggerDi = sinon.mock();
    loggerDi.atLeast(1);

    sourcemapReporterImpl(file, loggerDi);

    assert(loggerDi.calledTwice);
    assertSummary(loggerDi);
    assertViolation(loggerDi, 0, /VIOLATION_0/);
  });


  it('should print the summary and violations when the violations found', function() {
    var violations = [
      createViolation('VIOLATION_0'),
      createViolation('VIOLATION_1'),
    ];
    var file = createDummyFile(violations);
    var loggerDi = sinon.mock();
    loggerDi.atLeast(1);

    sourcemapReporterImpl(file, loggerDi);

    assert(loggerDi.calledThrice);
    assertSummary(loggerDi);
    assertViolation(loggerDi, 0 , /VIOLATION_0/);
    assertViolation(loggerDi, 1, /VIOLATION_1/);
  });
});


function createDummyFile(violations, opt_filePath) {
  var filePath = opt_filePath || 'DUMMY_FILE';

  return {
    path: filePath,
    csslint: { results: violations },
  };
}


function createViolation(opt_message, opt_line, opt_column) {
  return {
    error: {
      line: opt_line || 1,
      col: opt_column || 10,
      message: opt_message || 'VIOLATION',
      rule: {
        desc: 'RULE_DESC',
        id: 'ID',
      },
    },
  };
}


function assertSummary(loggerDi) {
  assert(loggerDi.called);
  assert(typeof loggerDi.args[0][0] === 'string');
}


function assertViolation(loggerDi, violationIndex, pattern) {
  // Expect loggerDi to be called for summary and each violations.
  var expectedCallCount = 1 + violationIndex;
  assert(loggerDi.callCount >= expectedCallCount + 1);

  assert(typeof loggerDi.args[violationIndex + 1][0] === 'string',
         'printed message are not string');
  assert(loggerDi.args[violationIndex + 1][0].match(pattern),
         'violation message not matched');
}
