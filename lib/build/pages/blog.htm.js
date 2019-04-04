const templater = require('../templater');
const tumblr = require('./../../tumblr');

module.exports = (folder) => {
    return tumblr(process.env.TUMBLR_API).then((blogs) => {
        return {
            config: {
                title: 'cieclarke.com',
                subtitle: '| Blog'
            },
            items: blogs
        };
    }).then((data) => {
        return templater('templates/blog.ejs', folder, data, { filename: 'blog.htm' });
    });
};
