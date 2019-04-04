const templater = require('../templater');
const flickr = require('./../../flickr');

module.exports = (folder) => {
    return flickr(process.env.FLICKR_API).then((photos) => {
        return {
            config: {
                title: 'cieclarke.com',
                subtitle: '| Photos'
            },
            images: photos
        };
    }).then((data) => {
        return templater('templates/photos.ejs', folder, data, { filename: 'photos.htm' });
    });
};
