/*jshint node:true */
/*
* Includes gulp-csslint
* https://github.com/lazd/gulp-csslint
*
* Copyright (c) 2013 Larry Davis
* Released under the MIT.
*/

'use strict';

var util = require('util');
var gutil = require('gulp-util');
var c = gutil.colors;
var SourceMapConsumer = require('source-map').SourceMapConsumer;

function sourcemapReporter(file) {
  var loggerDi = function(msg) { gutil.log(msg); };
  return sourcemapReporterImpl(file, loggerDi);
}


function sourcemapReporterImpl(file, loggerDi) {
  loggerDi(createSummary(file));

  file.csslint.results.forEach(function(result) {
    var violation = result.error;
    var position = getPosition(file, violation);

    var message = util.format(
      '%s%s:%s%s %s %s (%s)',
      c.red('['),
      c.yellow('L' + position.line),
      c.yellow('C' + position.column),
      c.red(']'),
      violation.message,
      violation.rule.desc,
      violation.rule.id
    );

    loggerDi(message);
  });
}


function createSummary(file) {
  var errorCount = file.csslint.errorCount;
  var error = errorCount === 1 ? 'error' : 'errors';

  return util.format(
    '%s %s found in %s',
    c.cyan(errorCount), error, c.magenta(file.path)
  );
}


function getPosition(file, violation) {
  var position = createPosition(violation);

  try {
    return getPositionBySourceMap(file, position);
  }
  catch (e) {
    if (e instanceof SourceMapNotFoundError) return position;
    if (e instanceof InvalidPositionError) return position;

    throw e;
  }
}


function getPositionBySourceMap(file, position) {
  if (file.sourceMap == undefined) {
    throw new SourceMapNotFoundError(file);
  }

  if (position.line <= 0 || position.column <= 0) {
    throw new InvalidPositionError(file, position);
  }

  var sourceMapConsumer = new SourceMapConsumer(file.sourceMap);
  var originalPos = sourceMapConsumer.originalPositionFor(position);

  return {
    line: originalPos.line,
    column: originalPos.column,
  };
}


function createPosition(violation) {
  return {
    line: violation.line,
    column: violation.col,
  };
}


function SourceMapNotFoundError(file) {
  var message = util.format('SourceMap not found: %s', file.path);
  Error.call(this, message);
}
util.inherits(SourceMapNotFoundError, Error);


function InvalidPositionError(file, position) {
  var message = util.format('line and column must be positive int: %d:%d at %s',
                            position.line, position.column, file.path);
  Error.call(this, message);
}
util.inherits(InvalidPositionError, Error);

module.exports = sourcemapReporter;
sourcemapReporter.impl = sourcemapReporterImpl;
