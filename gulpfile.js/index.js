const dotenv = require('dotenv');
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

if (process.env.NODE_ENV !== 'production') {
    dotenv.load();
}

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
    return Promise.all([flickr(process.env.FLICKR_API).done((photos) => {
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
    return Promise.all([tumblr(process.env.TUMBLR_API).done((blogs) => {
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
    const environment = process.env.NODE_ENV || 'development';
    const src = options.build.endsWith('/*') ? options.build : `${options.build}/*`;
    switch (environment) {
    case 'development':
        return gulp.src(src)
            .pipe(gulp.dest('/www/cieclarke.com'));
    case 'stage':
        return gulp.src(src)
            .pipe(gulp.dest('/www/cieclarke.com'));
    case 'production':
        return gulp.src(src)
            .pipe(ftp.create({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD
            }).dest(process.env.FTP_REMOTE_CIECLARKE));
    default:
        return null;
    }
});
