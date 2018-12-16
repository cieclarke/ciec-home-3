const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const chmod = require('gulp-chmod');
const gulp = require('gulp');
const sass = require('gulp-sass');
const globalConfig = require('./../site-config/global.json');
const flickr = require('./../lib/flickr');

gulp.task('photos.htm', () => {
    return Promise.all([flickr('61777036f4ecf11adb192f7156c6e92e').done((photos) => {
        return gulp.src('./templates/photos.ejs')
            .pipe(ejs({
                config: globalConfig,
                images: photos
            }))
            .pipe(rename('photos.htm'))
            .pipe(chmod(0o777))
            .pipe(gulp.dest('./dist'));
    })
    ]);
});

gulp.task('css', () => {
    return gulp.src('css/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
    return gulp.src('dist', { read: false, allowEmpty: true })
        .pipe(clean());
});

gulp.task('index.htm', () => {
    return gulp.src('./templates/index.ejs')
        .pipe(ejs({
            config: globalConfig
        }))
        .pipe(chmod(0o777))
        .pipe(rename('index.htm'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', () => {
    return gulp.src('dist/*')
        .pipe(gulp.dest('/'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('index.htm', 'photos.htm', 'css')));

gulp.task('deploy', gulp.series('default'));
