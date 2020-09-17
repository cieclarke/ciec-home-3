const templater = require('../templater');
const flickr = require('./../../flickr');

module.exports = (folder) => {
    return flickr(
        process.env.FLICKR_API,
        process.env.FLICKR_URI,
        process.env.FLICKR_USER
    ).then((photos) => {
        const t = photos.map((photo) => { return photo.tags; })
            .flat()
            .filter((word) => { return word.length > 0; })
            .filter((tag, i, arr) => { return arr.indexOf(tag) === i; });
        return {
            config: {
                title: 'cieclarke.com',
                subtitle: '| Photos'
            },
            tags: t,
            selectedTag: 'all',
            images: photos
        };
    }).then((data) => {
        const albumTemplates = [];
        data.tags.forEach((tag) => {
            const taggedImages = data.images.filter(
                (photo) => { return photo.tags.indexOf(tag) >= 0; }
            );
            const templateData = {
                config: {
                    title: 'cieclarke.com',
                    subtitle: `| Photos | ${tag}`
                },
                tags: data.tags,
                selectedTag: tag,
                images: taggedImages
            };
            albumTemplates.push(
                templater('templates/photos.ejs', folder, templateData, { filename: `${tag}.htm` })
            );
        });

        albumTemplates.push(templater('templates/photos.ejs', folder, data, { filename: 'photos.htm' }));

        return albumTemplates;
    }).then((templates) => {
        return Promise.all(templates).then((r) => {
            return r;
        });
    });
};
