/*jshint node:true */
/*
* Includes gulp-csslint
* https://github.com/lazd/gulp-csslint
*
* Copyright (c) 2013 Larry Davis
* Released under the MIT.
*/

'use strict';

var path = require('path');
var gutil = require('gulp-util');
var c = gutil.colors;
var SourceMapConsumer = require('source-map').SourceMapConsumer;

var sourcemapReporter = function (file) {
  var errorCount = file.csslint.errorCount;
  var plural = errorCount === 1 ? '' : 's';

  gutil.log(c.cyan(errorCount) + ' error' + plural + ' found in ' + c.magenta(file.path));

  file.csslint.results.forEach(function (result) {
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

    var msgInfo = message.message + ' ' + message.rule.desc + ' (' + message.rule.id + ')';

    var locInfo = c.red('(') + c.yellow(path.relative(process.cwd(), originalPos.source) + ':');
    if (typeof message.line !== 'undefined') {
      locInfo += c.yellow(lineNum) + c.red(':') + c.yellow(colNum);
    } else {
      locInfo += c.yellow('GENERAL');
    }
    locInfo += c.red(')');

    console.log(msgInfo, locInfo, '\n');
  });
};

module.exports = sourcemapReporter;
