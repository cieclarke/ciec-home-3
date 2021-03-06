const dotenv = require('dotenv');
const winston = require('winston');
const _ = require('lodash');
const clean = require('./clean');
const indexPage = require('./pages/index.htm');
const workPage = require('./pages/work.htm');
const notesPage = require('./pages/notes.htm');
const photosPage = require('./pages/photos.htm');
const css = require('./css/css');

if (process.env.NODE_ENV !== 'production') {
    dotenv.load();
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

clean(process.env.DEPLOYMENT_FOLDER).then((folder) => {
    Promise.all([
        notesPage(folder),
        indexPage(folder),
        workPage(folder),
        photosPage(folder),
        css(folder)
    ]).then((arr) => {
        const ps = arr.flat();
        logger.log('info', _.join(ps, '\n'), '');
    });
});
