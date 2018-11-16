var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var gulp = require('gulp');
var config = require('./../site-config/global.json')
var flickr = require('./../lib/flickr')

gulp.task('photos.htm', () => {

    return Promise.all([flickr('61777036f4ecf11adb192f7156c6e92e').done((photos) => {
        return gulp.src('./templates/photos.ejs')
            .pipe(ejs({
                config: config,
                images: photos
            }))
            .pipe(rename('photos.htm'))
            .pipe(gulp.dest("./dist"))
        })
    ]);

})

gulp.task('clean', () => {
    return gulp.src('dist', {read: false, allowEmpty: true})
        .pipe(clean());
})

gulp.task('index.htm', () => {
    return gulp.src('./templates/index.ejs')
        .pipe(ejs({
            config: config
        }))
        .pipe(rename('index.htm'))
        .pipe(gulp.dest("./dist"))
});

gulp.task('deploy', () => {
    return gulp.src('dist/*')
      .pipe(gulp.dest('/'));
})
  
gulp.task('default', gulp.series('clean', gulp.parallel('index.htm', 'photos.htm')));

gulp.task('deploy', gulp.series('default'));
