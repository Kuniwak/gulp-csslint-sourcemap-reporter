# gulp-csslint-sourcemap-reporter

Console reporter adjusting error locations by the source map.


## Install

First, install [gulp-csslint](https://github.com/lazd/gulp-csslint),
[gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps),
gulp-csslint-sourcemap-reporter as a development dependency:

    npm install --save-dev gulp-csslint-sourcemap-reporter

Then, add it to your gulpfile.js.


## Examples
### Less

```javascript
gulp.src('less/**/*.less'))
	.pipe(sourcemaps.init()) // Attach source maps
	.pipe(sass())            // Compile SCSS
	.pipe(csslint())         // Check the compiled code!
	.pipe(csslint.reporter(sourcemapReporter)); // Report with adjusted location
```


### SCSS

```javascript
gulp.src('less/**/*.less'))
	.pipe(sourcemaps.init()) // Attach source maps
	.pipe(sass())            // Compile SCSS
	.pipe(csslint())         // Check the compiled code!
	.pipe(csslint.reporter(sourcemapReporter)); // Report with adjusted location
```


## License

[MIT](http://kuniwak.mit-license.org/)
