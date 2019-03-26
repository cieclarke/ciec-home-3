const dotenv = require('dotenv');
const clean = require('./clean');
const indexPage = require('./pages/index.htm');
const workPage = require('./pages/work.htm');
const blogPage = require('./pages/blog.htm');
const photosPage = require('./pages/photos.htm');
const css = require('./css/css');

if (process.env.NODE_ENV !== 'production') {
    dotenv.load();
}

Promise.all([clean(process.env.DEPLOYMENT_FOLDER).then((folder) => {
    indexPage(folder);
    workPage(folder);
    blogPage(folder);
    photosPage(folder);
    css(folder);
})]);
