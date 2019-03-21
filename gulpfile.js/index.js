const dotenv = require('dotenv');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const gulp = require('gulp');
const ftp = require('vinyl-ftp');
const sass = require('gulp-sass');
const globalConfig = require('./../site-config/global.json');
const flickr = require('./../lib/flickr');
const tumblr = require('./../lib/tumblr');

const buildFolderName = 'dist';
const siteFilesFolder = `./${buildFolderName}`;

const buildFolderName = 'dist';
const siteFilesFolder = `./${buildFolderName}`;

if (process.env.NODE_ENV !== 'production') {
    dotenv.load();
}

gulp.task('clean', () => {
    return gulp.src(buildFolderName, { read: false, allowEmpty: true })
        .pipe(clean());
});

gulp.task('css', () => {
    return gulp.src('css/main.scss')
        .pipe(sass())
        .pipe(gulp.dest(siteFilesFolder));
});

gulp.task('photos.htm', () => {
    return Promise.all([flickr(process.env.FLICKR_API).done((photos) => {
        return gulp.src('./templates/photos.ejs')
            .pipe(ejs({
                config: globalConfig,
                images: photos
            }))
            .pipe(rename('photos.htm'))
            .pipe(gulp.dest(siteFilesFolder));
    })
    ]);
});

gulp.task('index.htm', () => {
    return gulp.src('./templates/index.ejs')
        .pipe(ejs({
            config: globalConfig
        }))
        .pipe(rename('index.htm'))
        .pipe(gulp.dest(siteFilesFolder));
});

gulp.task('blog.htm', () => {
    return Promise.all([tumblr(process.env.TUMBLR_API).done((blogs) => {
        return gulp.src('./templates/blog.ejs')
            .pipe(ejs({
                config: globalConfig,
                items: blogs
            }))
            .pipe(rename('blog.htm'))
            .pipe(gulp.dest(siteFilesFolder));
    })
    ]);
});

gulp.task('work.htm', () => {
    return gulp.src('./templates/work.ejs')
        .pipe(ejs({
            config: globalConfig
        }))
        .pipe(rename('work.htm'))
        .pipe(gulp.dest(siteFilesFolder));
});

gulp.task('default', gulp.series('clean', gulp.parallel('index.htm', 'photos.htm', 'blog.htm', 'work.htm', 'css')));

gulp.task('deploy', () => {
    const deployType = process.env.DEPLOYMENT_TYPE || 'NONE';
    const src = siteFilesFolder.endsWith('/*') ? siteFilesFolder : `${siteFilesFolder}/*`;
    switch (deployType) {
    case 'FOLDER':
        return gulp.src(src)
            .pipe(gulp.dest(process.env.DEPLOYMENT_FOLDER));
    case 'FTP':
        return gulp.src(src)
            .pipe(ftp.create({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD
            }).dest(process.env.DEPLOYMENT_FOLDER));
    default:
        return null;
    }
});
