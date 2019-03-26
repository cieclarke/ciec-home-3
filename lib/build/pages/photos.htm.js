const templater = require('../templater');
const flickr = require('./../../flickr');

module.exports = (folder) => {
    Promise.all([flickr(process.env.FLICKR_API).done((photos) => {
        const photosData = {
            config: {
                title: 'cieclarke.com',
                subtitle: '| Photos'
            },
            images: photos
        };
        templater('templates/photos.ejs', folder, photosData, { filename: 'photos.htm' });
    })
    ]);
};
