/**
 * @description Derived from Jase Warner's gulp-shopify
 * Website: https://github.com/jasewarner/gulp-shopify
 * This is Jase's script for the most part. Just made some mods.
 * @license GPL-3.0
 */

var argv = require('yargs').argv;
var gulp = require('gulp');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var browsersync = require('browser-sync').create();
var nano = require('cssnano');
var gulpif = require('gulp-if');
var del = require('del');
var addsrc = require('gulp-add-src');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var yaml = require('gulp-yaml');
var jsyaml = require('js-yaml');
var theme = require('gulp-shopify-theme').create();
var shopifyconfig = require('./shopifyconfig.json');

var processors = [
    autoprefixer({
        browsers: ['last 2 versions', 'ie >= 11']
    }), nano()
];

var DESTINATION = argv.dest || 'dist';
var USE_JS_UGLIFY = !!(argv.uglify || process.env.USE_JS_UGLIFY);
var USE_SOURCEMAPS = true;
var USE_BROWSER_SYNC = true;
var BROWSER_SYNC_PORT = parseInt(argv.browsersync) || parseInt(argv.bs) || parseInt(process.env.BROWSER_SYNC_PORT) || '3000';

var sourceMappingURLCSSregExp = new RegExp('(.*?[/*]{2,}# sourceMappingURL=)(.*?)([/*]{2})', 'g');
var sourceMappingURLJSregExp = new RegExp('(.*?[/*]{2,}# sourceMappingURL=)(.*?)', 'g');
var sourceMappingURLCSSreplace = '{% raw %}$1{% endraw %}$2{% raw %}$3{% endraw %}';
var sourceMappingURLJSreplace = '{% raw %}$1{% endraw %}$2';

shopifyconfig.root = process.cwd() + '/' + DESTINATION;

gulp.task('default', ['css', 'js', 'js-libs', 'fonts', 'images', 'copy', 'configs']);
gulp.task('dev', ['theme', 'default', 'browsersync', 'watch']);
gulp.task('clean', function () {
    return del(DESTINATION);
});

gulp.task('purge', ['theme'], function (done) {
    theme.purge();
    done();
});

gulp.task('theme', function () {
    theme.init(shopifyconfig);
});

gulp.task('watch', function () {
    USE_JS_UGLIFY = false;

    // Watch & run tasks
    gulp.watch('src/styles/**/*.{scss,liquid}', ['reload-on-css']);
    gulp.watch('src/scripts/theme.js', ['reload-on-js']);
    gulp.watch('src/assets/**/*.{js,gif,png,svg,liquid}', ['reload-on-copy']);
    gulp.watch(['src/scripts/vendor.js', 'src/scripts/vendor/*.js'], ['reload-on-js-libs']);
    gulp.watch('src/assets/fonts/**/*', ['reload-on-fonts']);
    gulp.watch('src/assets/images/**/*', ['reload-on-images']);
    gulp.watch('src/{layout,config,snippets,sections,templates,locales}/**/*', ['reload-on-copy']);
});

gulp.task('css', function () {
    return gulp.src('src/styles/theme.scss')
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: JSON.parse(error.toString())
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(replace(/({{|}}|{%|%})/g, '/*!$1*/')) // Comment out Liquid tags, so post-css doesn't trip out
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 2 versions', 'Explorer >= 11']
            }),
        ]))
        .pipe(replace(/\/\*!({{|}}|{%|%})\*\//g, '$1')) // Re-enable Liquid tags
        .pipe(rename('main.css.liquid'))
        .pipe(sourcemaps.write()) // css_all.css.map
        // .pipe( rename(appendLiquidExt)) // css_all.css.liquid
        // .pipe( replace( sourceMappingURLCSSregExp, sourceMappingURLCSSreplace ) )
        .pipe(gulp.dest(DESTINATION + '/assets'))
        .pipe(theme.stream());

});

gulp.task('js', () => {
    return gulp.src('src/scripts/theme.js')
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: error.toString()
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(sourcemaps.init())
        // .pipe( babel({presets: ['env']}) )
        .pipe(concat('main.js'))
        .pipe(gulpif(USE_JS_UGLIFY, uglify()))
        .pipe(sourcemaps.write())
        //.pipe( rename(appendLiquidExt))
        //.pipe( replace( sourceMappingURLJSregExp, sourceMappingURLJSreplace ) )
        .pipe(gulp.dest(DESTINATION + '/assets'))
        .pipe(theme.stream());
});

gulp.task('js-libs', () => {
    return gulp.src(['src/scripts/vendor.js', 'src/scripts/vendor/*.js'])
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: error.toString()
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(gulpif(USE_JS_UGLIFY, uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DESTINATION + '/assets'))
        .pipe(theme.stream());
});

gulp.task('fonts', () => {
    return gulp.src(['src/assets/fonts/**/*.{ttf,woff,woff2,eof,eot,otf,svg}'])
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: error.toString()
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(changed(DESTINATION))
        .pipe(rename(flatten))
        .pipe(rename({
            dirname: '',
            prefix: 'fonts_'
        }))
        .pipe(gulp.dest(DESTINATION + '/assets'))
        .pipe(theme.stream());
});

gulp.task('images', () => {
    return gulp.src(['src/assets/images/**/*.{svg,png,jpg,jpeg,gif,ico}', '!src/assets/images/src/**/*'])
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: error.toString()
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(changed(DESTINATION))
        .pipe(rename(flatten))
        .pipe(rename({
            dirname: '',
            prefix: 'images_'
        }))
        .pipe(gulp.dest(DESTINATION + '/assets'))
        .pipe(theme.stream());
});

gulp.task('copy', () => {
    return gulp.src(['src/{layout,snippets,templates,sections,assets}/**/*.{liquid,js,gif,svg}', 'src/config.yml', '!src/assets/images/src/**/*.*'])
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: JSON.stringify(error)
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(changed(DESTINATION))
        .pipe(gulp.dest(DESTINATION))
        .pipe(theme.stream());
});

gulp.task('configs', () => {
    return gulp.src(['src/{config,locales}/**/*.*'])
        .pipe(plumber({
            errorHandler: (error) => {
                notify.onError({
                    title: "Gulp error in " + error.plugin,
                    message: error.toString()
                })(error);
                // play a sound once
                gutil.beep(2);
            }
        }))
        .pipe(yaml({
            space: 2
        }))
        .pipe(changed(DESTINATION))
        .pipe(gulp.dest(DESTINATION))
        .pipe(theme.stream());
});

gulp.task('reload-on-css', ['css'], reload);
gulp.task('reload-on-js', ['js'], reload);
gulp.task('reload-on-js-libs', ['js-libs'], reload);
gulp.task('reload-on-fonts', ['fonts'], reload);
gulp.task('reload-on-images', ['images'], reload);
gulp.task('reload-on-copy', ['copy', 'configs'], reload);

function reload(done) {
    if (!USE_BROWSER_SYNC) return done();
    browsersync.reload();
    done();
}

gulp.task('browsersync', function (done) {
    if (!USE_BROWSER_SYNC) return done();
    browsersync.init(null, {
        port: BROWSER_SYNC_PORT,
        ui: {
            port: +BROWSER_SYNC_PORT + 1
        },
        proxy: 'https://' + shopifyconfig.shop_name + '.myshopify.com',
        browser: ['google chrome'],
        open: 'local',
        notify: true,
        startPath: "/?preview_theme_id=" + shopifyconfig.theme_id,
    }, done);
});

console.log('DESTINATION', DESTINATION);
console.log('USE_JS_UGLIFY', USE_JS_UGLIFY);
console.log('USE_SOURCEMAPS', USE_SOURCEMAPS);
console.log('USE_BROWSER_SYNC', USE_BROWSER_SYNC);
console.log('BROWSER_SYNC_PORT', BROWSER_SYNC_PORT);

function replaceYAMLwithJSON(match, g1) {
    if (match) {
        var yamlString = g1.replace(/{% (end)?schema %}/, '');
        var parsedYaml = jsyaml.safeLoad(yamlString);
        var jsonString = JSON.stringify(parsedYaml, null, '    ');
        return '{% schema %}\n' + jsonString + '\n{% endschema %}';
    }
}

function makeLiquidSourceMappingURL(file) {
    return "main.css.map";
}

function appendLiquidExt(path) {
    if (path.extname === '.map') return;
    // if (path.extname === '.css') {
    //     path.extname = '.scss';
    // }
    path.basename += path.extname;
    path.extname = '.liquid';
}

function flatten(path) {
    if (path.dirname !== '.') {
        path.basename = path.dirname.replace('/', '_') + '_' + path.basename;
    }
}