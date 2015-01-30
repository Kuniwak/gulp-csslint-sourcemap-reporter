/*jshint node:true */
/*
 * Includes gulp-csslint
 * https://github.com/lazd/gulp-csslint
 *
 * Copyright (c) 2013 Larry Davis
 * Released under the MIT.
*/

'use strict';

var gutil = require('gulp-util');
var c = gutil.colors;
var SourceMapConsumer = require('source-map').SourceMapConsumer;

var sourcemapReporter = function(file) {
  var errorCount = file.csslint.errorCount;
  var plural = errorCount === 1 ? '' : 's';

  gutil.log(c.cyan(errorCount)+' error'+plural+' found in '+c.magenta(file.path));

  file.csslint.results.forEach(function(result) {
    var message = result.error;

    var lineNum, colNum;
    if (file.sourceMap !== 'undefined') {
      var sourceMapConsumer = new SourceMapConsumer(file.sourceMap);
      var originalPos = sourceMapConsumer.originalPositionFor({
        line: message.line,
        column: message.col
      });
      lineNum = originalPos.line;
      colNum = originalPos.column;
    }
    else {
      lineNum = message.line;
      colNum = message.col;
    }

    gutil.log(
      c.red('[') +
      (
        typeof message.line !== 'undefined' ?
          c.yellow( 'L' + lineNum ) +
          c.red(':') +
          c.yellow( 'C' + colNum )
        :
          c.yellow('GENERAL')
      ) +
      c.red('] ') +
      message.message + ' ' + message.rule.desc + ' (' + message.rule.id + ')');
  });
};


module.exports = sourcemapReporter;
