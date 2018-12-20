const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const chmod = require('gulp-chmod');
const gulp = require('gulp');
const ftp = require('vinyl-ftp');
const sass = require('gulp-sass');
const globalConfig = require('./../site-config/global.json');
const flickr = require('./../lib/flickr');
const tumblr = require('./../lib/tumblr');
const options = require('./../options.json');

gulp.task('clean', () => {
    return gulp.src('dist', { read: false, allowEmpty: true })
        .pipe(clean());
});

gulp.task('css', () => {
    return gulp.src('css/main.scss')
        .pipe(sass())
        .pipe(gulp.dest(options.build));
});

gulp.task('photos.htm', () => {
    return Promise.all([flickr(options.flickr.api_key).done((photos) => {
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

gulp.task('index.htm', () => {
    return gulp.src('./templates/index.ejs')
        .pipe(ejs({
            config: globalConfig
        }))
        .pipe(chmod(0o777))
        .pipe(rename('index.htm'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('blog.htm', () => {
    return Promise.all([tumblr(options.tumblr.api_key).done((blogs) => {
        return gulp.src('./templates/blog.ejs')
            .pipe(ejs({
                config: globalConfig,
                items: blogs
            }))
            .pipe(rename('blog.htm'))
            .pipe(chmod(0o777))
            .pipe(gulp.dest('./dist'));
    })
    ]);
});

gulp.task('work.htm', () => {
    return gulp.src('./templates/work.ejs')
        .pipe(ejs({
            config: globalConfig
        }))
        .pipe(chmod(0o777))
        .pipe(rename('work.htm'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', gulp.series('clean', gulp.parallel('index.htm', 'photos.htm', 'blog.htm', 'work.htm', 'css')));

gulp.task('deploy', () => {
    const src = options.build.endsWith('/*') ? options.build : `${options.build}/*`;

    const conn = ftp.create({
        host: options.ftp.server.host,
        user: options.ftp.server.user,
        password: options.ftp.server.password
    });

    return gulp.src(src)
        .pipe(conn.dest(options.ftp.server.remote));
});
